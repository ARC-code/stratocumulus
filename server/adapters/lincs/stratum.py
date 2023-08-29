import requests
import asyncio
import aiohttp
import datetime
import json
import traceback
from time import sleep
from urllib.parse import quote
from slugify import slugify
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
    count_query_url = f"{corpora_url}Person/?page-size=0&a_histogram_decades=years_active__10"

    if query_params:
        count_query_url += '&' + format_get_params(query_params)

    print(count_query_url)
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
            {'id': '/lincs-people', 'kind': 'root', 'label': 'LINCS', 'fixed': True, 'value': result_count, 'decades': {}, 'parent': 'self'},
            {'id': '/lincs-people/affiliations', 'kind': 'grouping', 'label': 'Affiliations', 'value': 5000, 'parent': '/lincs-people/affiliations'},
            # {'id': '/lincs-people/attributes', 'kind': 'grouping', 'label': 'Attributes', 'value': 5000, 'parent': '/lincs-people/attributes'},
            # {'id': '/lincs-people/birth_place', 'kind': 'grouping', 'label': 'Birth Place', 'value': 5000, 'parent': '/lincs-people/birth_place'},
            {'id': '/lincs-people/professions', 'kind': 'grouping', 'label': 'Professions', 'value': 5000, 'parent': '/lincs-people/professions'},
            {'id': '/lincs-people/nations', 'kind': 'grouping', 'label': 'Nations', 'value': 5000, 'parent': '/lincs-people/nations'},
            {'id': '/lincs-people/graphs', 'kind': 'grouping', 'label': 'Datasets', 'value': 5000, 'parent': '/lincs-people/graphs'},
        ],
        'edges': [
            {'from': '/lincs-people', 'to': '/lincs-people/affiliations'},
            # {'from': '/lincs-people', 'to': '/lincs-people/attributes'},
            # {'from': '/lincs-people', 'to': '/lincs-people/birth_place'},
            {'from': '/lincs-people', 'to': '/lincs-people/professions'},
            {'from': '/lincs-people', 'to': '/lincs-people/nations'},
            {'from': '/lincs-people', 'to': '/lincs-people/graphs'},
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
            {'facet': 'affiliations', 'xref': False},
            # {'facet': 'attributes', 'xref': False},
            # {'facet': 'birth_place', 'xref': True},
            {'facet': 'professions', 'xref': True},
            {'facet': 'nations', 'xref': True},
            {'facet': 'graphs', 'xref': True},
        ],
        '/lincs-people',
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
    # TODO: uncomment line below to enable caching
    # redis_cache.set(cache_key, json.dumps(stratum_graph), ex=cache_expiry)

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
            query_prefix = f"{corpora_url}Person/?page-size=0"

            if query_params:
                query_prefix += '&' + format_get_params(query_params)

            facet_query = f"{query_prefix}&a_terms_{facet['facet']}={facet['facet']}"
            none_query = query_prefix + f"&e_{facet['facet']}=y"

            if facet['xref']:
                facet_query += f".id,{facet['facet']}.label.raw"
                none_query = query_prefix + f"&e_{facet['facet']}.id=y"

            queries.append(
                perform_facet_query(
                    session,
                    channel,
                    path,
                    facet,
                    connected_to,
                    facet_query,
                    none_query
                )
            )

        return await asyncio.gather(*queries, return_exceptions=True)


async def perform_facet_query(session, channel, path, facet, connected_to, facet_query, none_query=None):
    try:
        print(facet_query)
        async with session.get(facet_query) as resp:
            data = await resp.json()
            subgraphs = []

            if 'meta' in data and 'total' in data['meta'] and 'aggregations' in data['meta'] and facet['facet'] in data['meta']['aggregations']:

                total_results = data['meta']['total']

                for agg_key, agg_count in data['meta']['aggregations'][facet['facet']].items():
                    if facet['xref']:
                        node_parts = agg_key.split('|||')
                        facet_id = node_parts[0]
                        facet_label = node_parts[1]
                        facet_param = f"f_{facet['facet']}.id"
                        facet_value = facet_id
                    else:
                        facet_id = slugify(agg_key)
                        facet_label = agg_key
                        facet_param = f"f_{facet['facet']}"
                        facet_value = quote(facet_label)

                    node_attrs = {
                        'id': f"{connected_to}/{facet['facet']}/{facet_id}",
                        'label': facet_label,
                        'parent': f"{connected_to}/{facet['facet']}",
                        'kind': facet['facet'],
                        'value': agg_count,
                        'decades': {}, # leaving this key/value pair for now, but should eventually be removed
                        'is_facetable': True,
                        'facet_param': facet_param,
                        'facet_value': facet_value
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

                if none_query:
                    print(none_query)
                    async with session.get(none_query) as none_resp:
                        none_data = await none_resp.json()
                        if 'meta' in none_data and 'total' in none_data['meta']:

                            node_attrs = {
                                'id': f"{connected_to}/{facet['facet']}/none",
                                'label': "None",
                                'parent': f"{connected_to}/{facet['facet']}",
                                'kind': facet['facet'],
                                'value': total_results - none_data['meta']['total'],
                                'decades': {}, # leaving this key/value pair for now, but should eventually be removed
                                'is_facetable': True,
                                'facet_param': facet_param,
                                'facet_value': ''
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
