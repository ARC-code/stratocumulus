# Stratocumulus

This is a very barebones, initial README intended to help a bit with initial development.

## Building and Running the App

* Have Docker Desktop installed on your development machine and make sure it's running
* In a terminal, navigate to this locally cloned repo directory (the same directory as docker-compose.yml) and issue this command: `docker-compose up`
* Visit the prototype by opening a browser and navigating to localhost

## Development Notes

When making changes to code (including the HTML template file), those changes won't reflect on the running application until you kill the Docker Compose stack by going to the terminal running the Docker app, hitting ctrl+c, and then restarting the stack by running `docker-compose up` again.

### The Backend

The backend for this app is very simple at the moment. It's a Flask app (Python) that makes use of a Celery task queue and a Redis message broker for handling Server Sent Events. It currently features three HTTP endpoints:

* `/` < GET > This is the "index" page of the app, intended to be access via browser. Upon visiting this endpoint, the backend generates a session key and passes it to the HTML template located at `/app/templates/index.html`. For more info on this template, see "The Frontend" below.
* `/build_stratum` < GET > This endpoint is called by the frontend in order to build the initial graph for a stratum. For this purpose, a "path" can be passed in via GET parameter specifying the "location" of the stratum. At present, only the root stratum (path "/") is supported. It assumes that the frontend client has already subscribed to a Server Sent Events (SSE) channel. It launches an asynchronous task called "build_stratum" that is run by a Celery job queue. The "build_stratum" task is intended to be an "adapter" so that it can support multiple projects. At present, "ARC" is the only adapter implemented for this prototype. The task builds an initial subgraph and then performs queries on some initial facets, publishing these subgraphs to the SSE channel as it receives responses from the ARC API.
* `/publish` < POST > This endpoint allows the "build_stratum" task to publish subgraphs to the client.

The code for all three endpoints can be found in `app/stratocumulus.py`. The code for the ARC "build_stratum" task can be found in `app/adapters/arc/__init__.py`.

In the future, other endpoints will need to be created to handle things like semantic zoom events, saving/exporting the user's graph, etc.

### The Frontend

The frontend, though also simple, is a bit messy at present as it reflects a transition from using Vis.js to using Graphology.js to layout the graph. All code for the frontend is located in `app/templates/index.html`. In the future, a more adapter oriented file structure will be adopted so the app can support separate frontends for projects. At present, it only does the following:

* Loading the page causes the client to a) subscribe to the SSE channel and dictate what happens when subgraph messages are received on the channel's stream, and then b) call the /build_stratum endpoint. The code for these actions resides in the "DOMContentLoaded" event handler toward the top of the Javascript, which itself calls the "build_stratum" function directly below the handler.
* Upon receiving subgraph messages on the SSE channel, the client attempts to perform an initial, "circle pack" layout of the graph. This is intended to provide initial x/y coordinates for each node, grouping nodes together according to its parent. The code for this is in the "perform_layout" function. For debugging purposes, the "perform_layout" function also calls the "draw_graph" function, which at present tries to draw nodes as square, colored HTML divs.
* After calling the "perform_layout" function upon receiving subgraph messages, a timer commences (that timer is reset every time a new message is received). Once, however, the timer elapses, the "fit_network" function is called. This function was initially intended to make sure the vis.js rendered graph fits on the screen. Now that we're transitioning to Graphology (which only lays out the graph), all this function does is start a new timer, which when elapsed, calls the "take_network_snapshot" function. This function now calls "perform_layout" one last time, passing in "true" for the "final" parameter. When "final" is set to "true," perform_layout forgoes the circle pack layout and instead tries to adjust node positions via force layout, and then again via a "no overlap" layout. That "final" boolean is also then passed to "draw_graph," which causes lines to be drawn between nodes to reflect the existence of edges.

It's important to note that the current logic present in the "draw_graph" function is intended to be replaced by a more sophisticated, Tapspace/Affineplane rendering method. Once this has been implemented, there will no longer be a need for the jQuery and jQuery Connections libraries which are currently only used to facilitate the drawing of nodes and edges.

The use of external JS libraries is modeled via the importing of the Graphology libraries. To use an external library, place it in the `/app/static/js` directory and reference it using this Flask convention: `{{ url_for('static', filename='js/graphology.min.js') }}`