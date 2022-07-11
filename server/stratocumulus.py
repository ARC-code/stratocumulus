import logging
import uuid
import os
from flask import Flask, request, render_template, session
from flask_sse import sse
from adapters import arc
from celery import Celery

app = Flask(__name__,
            static_url_path='/static',
            static_folder=os.environ['STRATO_STATIC_FOLDER'])
app.secret_key = os.environ['STRATO_SECRET_KEY']
app.config["REDIS_URL"] = "redis://redis"
app.register_blueprint(sse, url_prefix='/stream')

client = Celery(app.name, broker=app.config['REDIS_URL'])
client.conf.update(app.config)

# flask-sse example: https://www.velotio.com/engineering-blog/how-to-implement-server-sent-events-using-python-flask-and-react


@app.route('/')
def index():
    sess_key = _get_strato_key()
    return render_template("index.html", key=sess_key)


@app.route('/build_stratum')
def build_stratum():
    sess_key = _get_strato_key()
    path = request.args.get('path', '/')
    context = {'path': path}

    for filter in request.args.keys():
        if filter != 'path':
            context[filter] = request.args[filter]

    wait = 0
    if path == '/':
        wait = 2
    launch_stratum_build_job.apply_async(args=[sess_key, context, wait])
    return "Building."


@app.route('/publish', methods=['POST'])
def publish_graph():
    key = request.args.get('key')
    sse.publish(request.json, type=key)
    return "Sent."


def _get_strato_key():
    if 'strato_key' not in session:
        session['strato_key'] = uuid.uuid1()

    return session['strato_key']


@client.task
def launch_stratum_build_job(key, context, wait):
    arc.build_stratum(key, context, wait)


if __name__ == '__main__':
    app.run(debug=True)
