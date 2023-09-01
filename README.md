# Stratocumulus

Millions of linked data documents and huge databases of semantic networks ask for a browser, a way to approach and explore the mass of entities. Stratocumulus approach the task with a zoomable nested network graph of facets. Each facet shaves the mass, a facet by facet, until you reach the entities and results which you are looking for. Just dive in. Stratocumulus lets you build your facet sequence by diving - and zooming - through facet nodes.

## Examples

[![BigDIVA Prototype](docs/stratocumulus_0.3.0_example.png)](http://prototype.bigdiva.org/)
Corpora database visualized with Stratocumulus. Two of the entity collections are faceted and their facet subgraphs rendered and zoomable.

## Resources

- [live prototype](http://prototype.bigdiva.org/)
- [Git repository](https://github.com/ARC-code/stratocumulus)
- [BigDIVA](https://bigdiva.org/)
- [Center of Digital Humanities Research](https://codhr.dh.tamu.edu/)
- [Stratocumulus Server API documentation](#the-backend)
- [Stratocumulus Client API documentation](https://arc-code.github.io/stratocumulus/client/docs/architecture.html)

## Browser and Research Features

- search documents and categories via fractal zooming
- search and filter by keywords
- filter by year range

## Technical Features

- SPA single page application
- HTML CSS JS Python Flask Celery Graphology Tapspace

## Building and Running the App

* Have [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed on your development machine and make sure it's running
* Replace placeholder environment variables in `docker-compose.yml` with your Corpora endpoint details.
* In a terminal, navigate to this locally cloned repo directory (the same directory as docker-compose.yml) and issue this command: `docker-compose up`
* Visit the prototype by opening a browser and navigating to [localhost](localhost)

## Development Workflow

When making changes to code (including the HTML template file), those changes won't reflect on the running application until you kill the Docker Compose stack by going to the terminal running the Docker app, hitting ctrl+c, and then restarting the stack by running `docker-compose up` again.

Changes to frontend code do not require container restarts or image rebuilds, only a few seconds and a page refresh. The changes under `client/lib` are automatically watched and the frontend code bundle rebuilt by webpack running in the frontend container. However, any changes outside `client/lib` – for example to `client/index.js` or `client/node_modules` – need an image rebuild with `docker-compose up --build`. Also, if you modify static files to be served by the backend, the volumes from where these static files are served need a reset with `docker-compose down --volumes`.

To inspect frontend build errors, see the console output of the frontend container via Docker Desktop or in the terminal in which you are running `docker-compose`.

To lint the frontend code to catch unused variables and other issues, cd to `client/` and run `npm run lint`. The frontend code should follow [JavaScript Standard Style](https://standardjs.com/).

### The Backend

The backend for this app is located under `server` dir. It's a Flask app (Python) that makes use of a Celery task queue and a Redis message broker for handling Server Sent Events. It currently features three HTTP endpoints:

* `/` < GET > This is the "index" page of the app, intended to be access via browser. Upon visiting this endpoint, the backend generates a session key and passes it to the HTML template located at `/server/templates/index.html`. For more info on this template, see "The Frontend" below.
* `/build_stratum` < GET > This endpoint is called by the frontend in order to build the initial graph for a stratum. For this purpose, a "path" can be passed in via GET parameter specifying the "location" of the stratum. At present, only the root stratum (path "/") is supported. It assumes that the frontend client has already subscribed to a Server Sent Events (SSE) channel. It launches an asynchronous task called "build_stratum" that is run by a Celery job queue. The "build_stratum" task is intended to be an "adapter" so that it can support multiple projects. At present, "ARC" is the only adapter implemented for this prototype. The task builds an initial subgraph and then performs queries on some initial facets, publishing these subgraphs to the SSE channel as it receives responses from the ARC API.
* `/publish` < POST > This endpoint allows the "build_stratum" task to publish subgraphs to the client.

The code for all three endpoints can be found in `server/stratocumulus.py`. The code for the ARC "build_stratum" task can be found in `server/adapters/arc/__init__.py`.

### The Frontend

The frontend code is located under `client` directory. As the frontend will consists of multiple javascript-files, stylesheets, and images, they must be bundled together and be served as static files by the backend. For the build process, the frontend has a Docker container that runs [webpack](https://webpack.js.org/). Webpack places the finished bundle to a volume that is shared with the container running the backend. In addition to the bundle, the backend serves an HTML page defined in `server/templates/index.html`. When a user opens the page, the browser requests the bundle and other assets from the backend.

In the future there can be multiple frontends. Each frontend should have its own directory and build process to avoid unnecessary dependencies.

At present, the client does the following:

* Loading the page causes the client to a) subscribe to the SSE channel and dictate what happens when subgraph messages are received on the channel's stream, and then b) call the /build_stratum endpoint. The code for these actions resides in the `client/lib/io` module.
* Upon receiving subgraph messages on the SSE channel, the client attempts to perform a circle pack layout of the graph. This is intended to provide initial x/y coordinates for each node, grouping nodes together according to its parent. The code for this is in the `render` method of each stratum class.
* Nodes in the graph are openable and will load and display a faceted version of the same stratum. Users can navigate further down inside the nodes to inspect the results. The code that handles automatic opening of nodes and recursive loading of nested strata resides in the `client/lib/Sky` component.

Additional details of frontend architecture are available in [Stratocumulus Client API documentation](https://arc-code.github.io/stratocumulus/client/docs/architecture.html)

## Licence

[MIT](LICENSE)
