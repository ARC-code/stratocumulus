import requests
from . import extract_query_params, format_get_params, corpora_url
from .graph_io import make_subgraph, make_node, make_nedge


graph_people_limit = 20
graph_artifact_limit = 20


def build_data_plane(channel, context):
    make_subgraph(channel, {
        'path': context['path'],
        'stage': 'initial',
        'provenance': 'corpora',
        'nodes': [
            {'id': '/results', 'label': 'Results', 'fixed': True, 'value': 5000, 'parent': 'self'},
            {'id': '/results/people', 'label': 'People', 'value': 5000, 'parent': '/results/people'},
            {'id': '/results/artifacts', 'label': 'Works', 'value': 5000, 'parent': '/results/artifacts'}
        ],
        'edges': [
            {'from': '/results', 'to': '/results/people'},
            {'from': '/results', 'to': '/results/artifacts'}
        ]
    })

    query_params = extract_query_params(context)

    # determine most referenced people
    people_query = f"{corpora_url}ArcArtifact/?page-size=0&a_terms_agents=agents.id"
    if query_params:
        people_query += '&' + format_get_params(query_params)
    print(people_query)
    people_request = requests.get(people_query)
    people_data = people_request.json()
    rendered_agent_ids = []

    if people_data and 'meta' in people_data and 'aggregations' in people_data['meta'] and \
            'agents' in people_data['meta']['aggregations']:

        for agent_id, agent_count in people_data['meta']['aggregations']['agents'].items():
            if len(rendered_agent_ids) < graph_people_limit:
                # get more detailed info about this agent
                agent_query = f"{corpora_url}ArcAgent/{agent_id}/"
                agent_request = requests.get(agent_query)
                agent_data = agent_request.json()

                if agent_data and 'entity' in agent_data and 'id' in agent_data['entity']:
                    entity_query = f"{corpora_url}ArcEntity/{agent_data['entity']['id']}"
                    entity_request = requests.get(entity_query)
                    entity_data = entity_request.json()

                    if entity_data and 'label' in entity_data:
                        make_nedge(
                            channel,
                            context['path'],
                            {
                                'id': f"/results/people/{agent_id}",
                                'label': entity_data['label'],
                                'parent': '/results/people',
                                'kind': 'Person',
                                'value': agent_count,
                            }
                        )

                        rendered_agent_ids.append(agent_id)
            else:
                break

    # render first artifacts
    art_query = f"{corpora_url}ArcArtifact?page-size={graph_artifact_limit}&only=label,agents"
    if query_params:
        art_query += '&' + format_get_params(query_params)
    art_request = requests.get(art_query)
    art_data = art_request.json()
    if art_data and 'records' in art_data and art_data['records']:
        art_edges = []

        for art in art_data['records']:
            make_nedge(
                channel,
                context['path'],
                {
                    'id': f"/results/artifacts/{art['id']}",
                    'label': art['label'],
                    'parent': '/results/artifacts',
                    'kind': 'Artifact',
                    'value': 5000,
                }
            )

            for art_agent in art['agents']:
                if art_agent['id'] in rendered_agent_ids:
                    art_edges.append({
                        'from': f"/results/artifacts/{art['id']}",
                        'to': f"/results/people/{art_agent['id']}"
                    })

        if art_edges:
            make_subgraph(channel, {
                'path': context['path'],
                'stage': 'update',
                'provenance': 'corpora',
                'nodes': [],
                'edges': art_edges
            })

    # tell client we're done building graph!
    make_subgraph(channel, {
        'path': context['path'],
        'stage': 'final',
        'provenance': 'corpora',
        'nodes': [],
        'edges': []
    })
