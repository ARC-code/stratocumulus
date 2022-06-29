import requests
import aiohttp
import asyncio
from time import sleep


def build_stratum(channel, context={}, wait=0):
    # optional wait in seconds, as a way, for example,
    # to allow a browser time to subscribe
    sleep(wait)

    make_subgraph(channel, {
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
    })

    loop = asyncio.get_event_loop()
    loop.run_until_complete(build_facets(
        channel,
        context['path'],
        [
            'federations',
            'genres',
            'disciplines',
        ],
        '/arc'
    ))



async def build_facets(channel, path, facets, connected_to, query_params=None):
    async with aiohttp.ClientSession() as session:
        for facet in facets:
            facet_query = "https://corpora.dh.tamu.edu/api/corpus/5f623b8eff276600a4f44553/ArcArtifact/?page-size=0&a_terms_{facet}={facet}.id,{facet}.label.raw".format(
                facet=facet
            )

            if query_params:
                for param, val in query_params.items():
                    facet_query += "&{param}={val}".format(param=param, val=val)

            print(facet_query)

            async with session.get(facet_query) as resp:
                data = await resp.json()

                if 'meta' in data and \
                        'aggregations' in data['meta'] and \
                        facet in data['meta']['aggregations']:

                    for agg_key, agg_count in data['meta']['aggregations'][facet].items():
                        node_parts = agg_key.split('|||')
                        make_nedge(
                            channel,
                            path,
                            "{connected_to}/{facet}/{id}".format(connected_to=connected_to, facet=facet, id=node_parts[0]),
                            node_parts[1],
                            "{connected_to}/{facet}".format(connected_to=connected_to, facet=facet),
                            facet,
                            agg_count
                        )


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


def make_subgraph(channel, graph):
    requests.post(
        'http://stratocumulus:8000/publish?key={0}'.format(channel),
        json=graph
    )