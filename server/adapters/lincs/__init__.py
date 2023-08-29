import os
import redis


# instantiate a redis client for caching built stratum graphs
redis_cache = redis.Redis(host="redis", decode_responses=True)
cache_expiry = 60 * 60

# api URL for host and corpus
corpora_host = os.environ.get('STRATO_CORPORA_HOST', '')
corpora_corpus_id = os.environ.get('STRATO_CORPORA_CORPUS_ID', '')
corpora_url = f"{corpora_host}/api/corpus/{corpora_corpus_id}/"

def extract_query_params(context):
    query_params = {}
    for param in context.keys():
        if param in [
            'q',
            'operator',
            'es_debug',
            'es_debug_query'
        ] or param[:2] in ['q_', 't_', 'p_', 's_', 'f_', 'r_', 'w_', 'e_', 'a_']:
            query_params[param] = context[param]

    return query_params


def format_get_params(params):
    get_params = []
    for param in params.keys():
        get_params.append(f"{param}={params[param]}")

    return "&".join(get_params)
