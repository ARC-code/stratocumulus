import requests
import asyncio
import aiohttp
import datetime
import json
import traceback
from time import sleep
from . import redis_cache, cache_expiry, corpora_url, extract_query_params, format_get_params
from .graph_io import make_subgraph, make_node, make_nedge
from .data_plane import build_data_plane


minimum_aggregated_records = 101


# this function builds strata graphs.
#
# "channel" represents a unique browser session
# "request_identifier" is the request
#   path (starting with /build_stratum) used to fire off the asynchronous task running this code, and is used as the
#   redis cache key.
# "context" is a dictionary containing GET variables passed to /build_stratum, containing information like the path and
#   any facet/search specifications
def build_stratum(channel, cache_key, context={}, wait=0):

    # optional wait in seconds, as a way, for example,
    # to allow a browser time to subscribe
    sleep(wait)

    # to support faceting/filtering/searching, find any valid GET params passed in via "context" and add them to this
    # "query_params" dict to pass along to the "build_facets" function
    query_params = extract_query_params(context)

    # before we start building the graph, let's check to make sure our query matches the minimum number of results to
    # justify an aggregated view of the data
    result_count = 0
    total_decades = {}
    count_query_url = f"{corpora_url}ArcArtifact/?page-size=0&r_years=400to2100&a_histogram_decades=years__10"
    if query_params:
        count_query_url += '&' + format_get_params(query_params)
    count_request = requests.get(count_query_url)
    count_data = count_request.json()
    if count_data and 'meta' in count_data \
            and 'total' in count_data['meta'] \
            and 'aggregations' in count_data['meta'] \
            and 'decades' in count_data['meta']['aggregations']:

        result_count = count_data['meta']['total']
        total_decades = count_data['meta']['aggregations']['decades']

        # sanity clean-up for decades
        this_year = datetime.date.today().year
        decade_keys = list(total_decades.keys())
        for decade_key in decade_keys:
            decade = int(decade_key.split('.')[0])
            if decade < 400 or decade > this_year:
                del total_decades[decade_key]

    print(f"TOTAL RESULTS: {result_count}")
    if result_count < minimum_aggregated_records:
        print("NEED TO RENDER INDIVIDUAL RESULTS!")
        build_data_plane(channel, context)
        return

    # build initial skeleton for the stratum graph
    stratum_graph = {
        'path': context['path'],
        'stage': 'initial',
        'structure': 'stratum_graph',
        'provenance': 'corpora',
        'exhausted': False,
        'decades': total_decades,
        'size': result_count,
        'nodes': [
            {'id': '/arc', 'kind': 'root', 'label': 'ARC', 'fixed': True, 'value': result_count, 'decades': {}, 'parent': 'self'},
            {'id': '/arc/federations', 'kind': 'grouping', 'label': 'Federations', 'value': 5000, 'parent': '/arc/federations'},
            {'id': '/arc/genres', 'kind': 'grouping', 'label': 'Genres', 'value': 5000, 'parent': '/arc/genres'},
            {'id': '/arc/disciplines', 'kind': 'grouping', 'label': 'Disciplines', 'value': 5000, 'parent': '/arc/disciplines'},
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
        '/arc',
        query_params
    ))

    # now that we have an array of arrays of subgraphs, iterate over them and add each node and edge to the larger
    # stratum graph for caching. while we do that, though, try to detect if no nodes are facetable, in which case
    # we need to display more granular data.
    has_facetable_nodes = False

    for facet_graph in facet_graphs:
        for facet_subgraph in facet_graph:
            if 'nodes' in facet_subgraph:
                for node in facet_subgraph['nodes']:
                    if 'is_facetable' in node:
                        has_facetable_nodes = True

                    stratum_graph['nodes'].append(node)

            if 'edges' in facet_subgraph:
                for edge in facet_subgraph['edges']:
                    stratum_graph['edges'].append(edge)

    # set the scope and provenance so we can cache the full stratum graph preventing us from having to rebuild it
    # every time!
    stratum_graph['stage'] = 'final'
    stratum_graph['provenance'] = 'cache'
    redis_cache.set(cache_key, json.dumps(stratum_graph), ex=cache_expiry)

    # now that we've cached the full graph, let's declare the graph as fully built to the client so edges can be drawn,
    # etc.
    make_subgraph(channel, {
        'path': context['path'],
        'stage': 'final',
        'provenance': 'corpora',
        'exhausted': not has_facetable_nodes,
        'nodes': [],
        'edges': []
    })


async def build_facets(channel, path, facets, connected_to, query_params={}):
    # TODO figure out why requests occasionally hang on MacOS, forcing user to wait for timeout before any further requests can occur

    async with aiohttp.ClientSession(trust_env=True) as session:
        queries = []
        for facet in facets:
            query_prefix = f"{corpora_url}ArcArtifact/?page-size=0&r_years=400to2100"

            if query_params:
                query_prefix += '&' + format_get_params(query_params)

            facet_query = f"{query_prefix}&a_terms_{facet}={facet}.id,{facet}.label.raw"
            # time_query_template = query_prefix + "&f_{facet}.id={{facet_id}}&a_histogram_decades=years__10&a_histogram_halfcenturies=years__50&a_histogram_centuries=years__100".format(facet=facet)
            # time_query_template = query_prefix + "&f_{facet}.id={{facet_id}}&a_histogram_decades=years__10".format(facet=facet)

            queries.append(
                perform_facet_query(
                    session,
                    channel,
                    path,
                    facet,
                    connected_to,
                    facet_query,
                    # time_query_template
                )
            )

        return await asyncio.gather(*queries, return_exceptions=True)


async def perform_facet_query(session, channel, path, facet, connected_to, facet_query, time_query_template=None):
    try:
        async with session.get(facet_query) as resp:
            data = await resp.json()
            subgraphs = []

            if 'meta' in data and 'total' in data['meta'] and 'aggregations' in data['meta'] and facet in data['meta']['aggregations']:

                total_results = data['meta']['total']

                for agg_key, agg_count in data['meta']['aggregations'][facet].items():
                    node_parts = agg_key.split('|||')
                    facet_id = node_parts[0]
                    facet_label = node_parts[1]

                    # TODO: clean up this commented-out time query code; leaving here for now just in case
                    # time_query = time_query_template.format(facet_id=facet_id)
                    # async with session.get(time_query) as time_resp:
                    #    time_data = await time_resp.json()
                    #    if 'meta' in time_data \
                    #            and 'aggregations' in time_data['meta'] \
                    #            and 'decades' in time_data['meta']['aggregations']: # and 'halfcenturies' in time_data['meta']['aggregations']: and 'centuries' in time_data['meta']['aggregations']:

                    node_attrs = {
                        'id': f"{connected_to}/{facet}/{facet_id}",
                        'label': facet_label,
                        'parent': f"{connected_to}/{facet}",
                        'kind': facet,
                        'value': agg_count,
                        'decades': {}, # leaving this key/value pair for now, but should eventually be removed
                        # 'decades': time_data['meta']['aggregations']['decades'],
                        # 'halfcenturies': time_data['meta']['aggregations']['halfcenturies'],
                        # 'centuries': time_data['meta']['aggregations']['centuries'],
                        'is_facetable': True,
                        'facet_param': f"f_{facet}.id",
                        'facet_value': facet_id
                    }

                    # check if node is facetable by seeing if the aggregate it
                    # represents is less than the total amount of records
                    if agg_count == total_results:
                        del node_attrs['is_facetable']

                    subgraphs.append(make_nedge(
                        channel,
                        path,
                        node_attrs
                    ))

            return subgraphs
    # This try/except block is for troubleshooting connection hanging problem on MacOS; not a permanent solution
    except:
        print(traceback.format_exc())
        return []
