// An adapter to the stream connection.
//
// Architectural note:
// If the connection method changes in the future, we can limit
// the impact to this adapter code instead of rewriting the app.
//

const Emitter = require('component-emitter');

// Get connection configuration etched to the html by the server.
const STREAM_URL = window.stratocumulus.sseStreamUrl;
const STREAM_KEY = window.stratocumulus.sseStreamKey;

// Use only one stream; the singleton pattern.
let graph_stream = null;

// Keep track what paths we listen.
const pathEmitter = new Emitter();

exports.connect = function () {
  // Open a SSE stream and begin to listen to events.
  //
  if (graph_stream) {
    // Stream already started. No need to restart.
    return;
  }

  // Open stream and begin listen all the events.
  graph_stream = new window.EventSource(STREAM_URL);
  graph_stream.addEventListener(STREAM_KEY, function (ev) {
    const data = JSON.parse(ev.data);

    // Check event format
    if (data && data.path) {
      const path = data.path;

      if (pathEmitter.hasListeners(path)) {
        // Handlers for the path are available.
        // Execute each handler function.
        pathEmitter.emit(path, data);
      } else {
        // No handlers set for the path.
        // In development, we like to know if this happens.
        console.warn('Received an event with unregisterd path: ' + path);
      }
    } else {
      // In development, we'd like to know if ev has no path.
      console.warn('Unknown SSE event format detected', data);
    }
  });
};

exports.on = function (path, handler) {
  // Register a path listener.
  // The handler will be called with a subgraph object
  // when an event with the given path arrives.
  //
  // Parameters:
  //   path
  //     string
  //   handler
  //     function(subgraph)
  //

  // Validate
  if (typeof path !== 'string') {
    throw new Error('Invalid path event to listen: ' + path);
  }
  if (typeof handler !== 'function') {
    throw new Error('Invalid path event handler function: ' + handler);
  }

  pathEmitter.on(path, handler);
};

exports.off = function (path, handler) {
  // Unregister a path listener
  //
  // Parameters:
  //   path
  //     a string
  //   handler
  //     optional handler function. If omitted, removes all handler
  //     functions for the given path.
  //

  if (typeof path !== 'string') {
    throw new Error('Invalid path to unregister: ' + path);
  }

  pathEmitter.off(path, handler);
};

exports.sendStratumBuildJob = function (path, context) {
  // Send a job to server to build a stratum.
  // The job result arrives later and triggers listeners for this path.
  //
  // Parameters:
  //   path
  //     string, the stratum path
  //   context
  //     object to be converted into url query attributes ?key=value&...
  //

  if (!graph_stream) {
    throw new Error('No stream available.');
  }

  const http = new window.XMLHttpRequest();
  let request_url = `/build_stratum?path=${path}`;
  Object.keys(context).forEach(key => {
    request_url += `&${key}=${context[key]}`;
  });
  http.open('GET', request_url);
  http.send();
};
