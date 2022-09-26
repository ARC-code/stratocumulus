import requests
import aiohttp
import asyncio
import json
import redis
from time import sleep


# instantiate a redis client for caching built stratum graphs
redis_cache = redis.Redis(host="redis", decode_responses=True)


# this function builds strata graphs.
#
# "channel" represents a unique browser session
# "request_identifier" is the request
#   path (starting with /build_stratum) used to fire off the asynchronous task running this code, and is used as the
#   redis cache key.
# "context" is a dictionary containing GET variables passed to /build_stratum, containing information like the path and
#   any facet/search specifications
def build_stratum(channel, request_identifier, context={}, wait=0):

    # optional wait in seconds, as a way, for example,
    # to allow a browser time to subscribe
    sleep(wait)

    # build skeleton for the stratum graph
    stratum_graph = {
        'path': context['path'],
        'nodes': [
            {'id': '/arc', 'label': 'ARC', 'fixed': True, 'value': 5000, 'parent': 'self'},
            {'id': '/arc/federations', 'label': 'Federations', 'value': 5000, 'parent': '/arc/federations'},
            {'id': '/arc/genres', 'label': 'Genres', 'value': 5000, 'parent': '/arc/genres'},
            {'id': '/arc/disciplines', 'label': 'Disciplines', 'value': 5000, 'parent': '/arc/disciplines'},
        ],
        'edges': [
            {'from': '/arc', 'to': '/arc/federations'},
            {'from': '/arc', 'to': '/arc/genres'},
            {'from': '/arc', 'to': '/arc/disciplines'}
        ]
    }

    # publish the skeleton to the browser client immediately
    make_subgraph(channel, stratum_graph)

    # fire off the "build_facets" function asynchronously. it returns an array (one item per facet),
    # and each of those items are themselves arrays of subgraphs. we'll use these to constitute the full facet graph
    # for the purpose of caching
    loop = asyncio.get_event_loop()
    facet_graphs = loop.run_until_complete(build_facets(
        channel,
        context['path'],
        [
            'federations',
            'genres',
            'disciplines',
        ],
        '/arc'
    ))

    # now that we have an array of arrays of subgraphs, iterate over them and add each node and edge to the larger
    # stratum graph for caching
    for facet_graph in facet_graphs:
        for facet_subgraph in facet_graph:
            if 'nodes' in facet_subgraph:
                for node in facet_subgraph['nodes']:
                    stratum_graph['nodes'].append(node)

            if 'edges' in facet_subgraph:
                for edge in facet_subgraph['edges']:
                    stratum_graph['edges'].append(edge)

    # cache the full stratum graph so we don't have to rebuild it every time!
    redis_cache.set(request_identifier, json.dumps(stratum_graph))


async def build_facets(channel, path, facets, connected_to, query_params=None):
    async with aiohttp.ClientSession() as session:
        queries = []
        for facet in facets:
            facet_query = "https://corpora.dh.tamu.edu/api/corpus/5f623b8eff276600a4f44553/ArcArtifact/?page-size=0&a_terms_{facet}={facet}.id,{facet}.label.raw".format(
                facet=facet
            )

            if query_params:
                for param, val in query_params.items():
                    facet_query += "&{param}={val}".format(param=param, val=val)

            queries.append(
                perform_facet_query(
                    session,
                    channel,
                    path,
                    facet,
                    connected_to,
                    facet_query
                )
            )

        return await asyncio.gather(*queries, return_exceptions=True)


async def perform_facet_query(session, channel, path, facet, connected_to, facet_query):
    async with session.get(facet_query) as resp:
        data = await resp.json()
        subgraphs = []

        if 'meta' in data and \
                'aggregations' in data['meta'] and \
                facet in data['meta']['aggregations']:

            for agg_key, agg_count in data['meta']['aggregations'][facet].items():
                node_parts = agg_key.split('|||')
                subgraphs.append(make_nedge(
                    channel,
                    path,
                    "{connected_to}/{facet}/{id}".format(connected_to=connected_to, facet=facet, id=node_parts[0]),
                    node_parts[1],
                    "{connected_to}/{facet}".format(connected_to=connected_to, facet=facet),
                    facet,
                    agg_count
                ))

        return subgraphs



def make_node(channel, path, uri, label, kind=None, value=None):
    subgraph = {
        'path': path,
        'nodes': [
            {
                'id': uri,
                'label': label,
            }
        ],
    }

    if kind:
        subgraph['nodes'][0]['kind'] = kind

    if value:
        subgraph['nodes'][0]['value'] = value

    make_subgraph(channel, subgraph)
    return subgraph


def make_nedge(channel, path, uri, label, from_uri, kind=None, value=None):
    subgraph = {
        'path': path,
        'nodes': [
            {
                'id': uri,
                'label': label,
                'parent': from_uri
            }
        ],
        'edges': [
            {
                'from': from_uri,
                'to': uri
            }
        ]
    }

    if kind:
        subgraph['nodes'][0]['kind'] = kind

    if value:
        subgraph['nodes'][0]['value'] = value

    make_subgraph(channel, subgraph)
    return subgraph


def make_subgraph(channel, graph):
    requests.post(
        'http://stratocumulus:8000/publish?key={0}'.format(channel),
        json=graph
    )