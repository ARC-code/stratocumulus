import logging
import uuid
import os
from flask import Flask, request, render_template, session
from flask_sse import sse
from time import sleep
from adapters import arc
from celery import Celery


# instantiate and configure our Flask app, including SSE (server sent events).
# for an example Flask+SSE app, see here: https://www.velotio.com/engineering-blog/how-to-implement-server-sent-events-using-python-flask-and-react
app = Flask(__name__,
            static_url_path='/static',
            static_folder=os.environ['STRATO_STATIC_FOLDER'])
app.secret_key = os.environ['STRATO_SECRET_KEY']
app.config["REDIS_URL"] = "redis://redis"
app.register_blueprint(sse, url_prefix='/stream')

# instantiate and configure our Celery client
client = Celery(app.name, broker=app.config['REDIS_URL'])
client.conf.update(app.config)


# this is the root endpoint for our app. it renders the HTML for the client
@app.route('/')
def index():
    # either retrieve our unique session key or create a new one if doesn't exist
    sess_key = _get_strato_key()

    # render the HTML template injecting our session key
    return render_template("index.html", key=sess_key)


# this endpoint is called by the client when it's ready to build a "stratum," which here signifies a bird's eye view of
# a large dataset in the form of a network graph, where "facets" are represented as nodes, and the values for each facet
# represented as child nodes
@app.route('/build_stratum')
def build_stratum():
    # retrieve our unique session key
    sess_key = _get_strato_key()

    # make sure we have a path for our stratum; if not specified via GET param, assume root (/)
    path = request.args.get('path', '/')

    # if requesting the root path, set "wait" to number of seconds to pause before sending bits of our stratum graph.
    # the idea is to give the browser a chance to subscribe to the SSE (server sent events) feed
    wait = 0
    if path == '/':
        wait = 2

    # check if we've already built this stratum before and cached the entire stratum's graph
    cached_response = sse.redis.get(request.full_path)
    if cached_response:
        app.logger.info('got cached response')
        if wait:
            sleep(wait)

        # since we have the cached response, go ahead and publish it to the SSE feed
        sse.publish(cached_response.decode('utf-8'), type=sess_key)
    else:
        # since we haven't built this stratum before, we need to build it. this might involve some longer than ideal
        # HTTP requests, so we'll do our building asynchronously by launching a Celery task
        launch_stratum_build_job.apply_async(args=[sess_key, request.full_path, request.args, wait])
    return "Building."


# this endpoint is for immediately publishing "subgraphs" (or small bits of the larger stratum) to the SSE stream the
# to which the client is subscribed, allowing for the asynchronous "build_stratum" job to stream content as it goes
# (rather than having to wait for the entire stratum to be built). this endpoint can also be used to publish the
# entirety of a stratum cached by Redis.
@app.route('/publish', methods=['POST'])
def publish_graph():
    key = request.args.get('key')
    sse.publish(request.json, type=key)
    return "Sent."


# this helper function simply returns a unique key for our session if it exists, and otherwise generates and stores the
# key before returning it.
def _get_strato_key():
    if 'strato_key' not in session:
        session['strato_key'] = uuid.uuid1()

    return session['strato_key']


# this is the asynchronous task we use to build a stratum's graph. the idea is for this to eventually be
# pluggable via adapter style code. for now we only have ARC registered, so our asynchronous task here just calls the
# "build_stratum" function belonging to the "arc" module
@client.task
def launch_stratum_build_job(key, request_identifier, context, wait):
    arc.build_stratum(key, request_identifier, context, wait)


if __name__ == '__main__':
    app.run(debug=True)
else:
    # these lines allow us to sync up the gunicorn and Flask log handlers so Flask logging appears in Gunicorn's stdout/
    # stderr outputs
    gunicorn_logger = logging.getLogger('gunicorn.error')
    app.logger.handlers = gunicorn_logger.handlers
    app.logger.setLevel(gunicorn_logger.level)
