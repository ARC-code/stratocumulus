import requests


def make_node(channel, path, node_attrs, stage='update', provenance='corpora'):
    subgraph = {
        'path': path,
        'stage': stage,
        'provenance': provenance,
        'nodes': [
            node_attrs
        ],
    }

    make_subgraph(channel, subgraph)
    return subgraph


def make_nedge(channel, path, node_attrs, stage='update', provenance='corpora'):
    if 'id' in node_attrs and 'parent' in node_attrs:

        subgraph = {
            'path': path,
            'stage': stage,
            'provenance': provenance,
            'nodes': [
                node_attrs
            ],
            'edges': [
                {
                    'from': node_attrs['parent'],
                    'to': node_attrs['id']
                }
            ]
        }

        make_subgraph(channel, subgraph)
        return subgraph
    return {}


def make_subgraph(channel, graph):
    requests.post(
        'http://stratocumulus:8000/publish?key={0}'.format(channel),
        json=graph
    )