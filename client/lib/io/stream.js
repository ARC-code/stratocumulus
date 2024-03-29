// An adapter to the stream connection.
//
// Usage:
// - open a stream: stream.connect()
// - listen stratum events: stream.on(path, callback)
// - stop listening events: stream.off(path[, callback])
// - send a job: stream.sendStratumBuildJob(path, context)
//
// Architectural note:
// This stream module uses a singleton pattern. Thus multiple connect() calls
// open the stream only once.
//
// Architectural note:
// If the connection method changes in the future, we can limit
// the impact to this adapter code instead of rewriting the app.
//

const Emitter = require('component-emitter')

// Get connection configuration etched to the html by the server.
const STREAM_URL = window.stratocumulus.sseStreamUrl
const STREAM_KEY = window.stratocumulus.sseStreamKey

// Use only one stream; the singleton pattern.
let graphStream = null

// Keep track what paths we listen.
const pathEmitter = new Emitter()

exports.connect = function () {
  // @io.stream.connect()
  //
  // Open a SSE stream and begin to listen to events.
  //
  if (graphStream) {
    // Stream already started. No need to restart.
    return
  }

  // Open stream and begin listen all the events.
  graphStream = new window.EventSource(STREAM_URL)
  graphStream.addEventListener(STREAM_KEY, function (ev) {
    const data = JSON.parse(ev.data)
    // DEBUG
    const msg = `${data.stage} for '${data.path}' ` +
      `(edges:${data.edges.length}, nodes:${data.nodes.length})`
    console.log('Incoming SSE event: ' + msg)
    // console.log(JSON.stringify(data.nodes))

    // Check event format
    if (data && data.path) {
      const path = data.path

      if (pathEmitter.hasListeners(path)) {
        // Handlers for the path are available.
        // Execute each handler function.
        pathEmitter.emit(path, data)
      } else {
        // No handlers set for the path.
        // In development, we like to know if this happens.
        console.warn('Incoming SSE event with unregistered path: ' + path)
      }
    } else {
      // In development, we'd like to know if ev has no path.
      console.warn('Unknown SSE event format detected', data)
    }
  })
}

exports.on = function (path, handler) {
  // @io.stream.on(path, handler)
  //
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
    throw new Error('Invalid path event to listen: ' + path)
  }
  if (typeof handler !== 'function') {
    throw new Error('Invalid path event handler function: ' + handler)
  }

  pathEmitter.on(path, handler)
}

exports.off = function (path, handler) {
  // @io.stream.off(path, handler)
  //
  // Unregister a path listener
  //
  // Parameters:
  //   path
  //     a string
  //   handler
  //     optional handler function. If omitted, removes all handler
  //     .. functions for the given path.
  //

  if (typeof path !== 'string') {
    throw new Error('Invalid path to unregister: ' + path)
  }

  pathEmitter.off(path, handler)
}

exports.sendStratumBuildJob = function (path, context) {
  // @io.stream.sendStratumBuildJob(path, context)
  //
  // Send a job to server to build a stratum.
  // The job result arrives later and triggers listeners for this path.
  //
  // Parameters:
  //   path
  //     string, the stratum path
  //   context
  //     a Context
  //

  if (!graphStream) {
    throw new Error('No stream available.')
  }

  const ctx = context.toContextObject()

  // DEBUG
  const msg = `get '${path}' with context ${JSON.stringify(ctx)}`
  console.log('Outgoing request: ' + msg)

  const http = new window.XMLHttpRequest()
  let requestUrl = `/build_stratum?path=${encodeURIComponent(path)}`
  Object.keys(ctx).forEach(key => {
    requestUrl += `&${key}=${ctx[key]}`
  })
  http.open('GET', requestUrl)
  http.send()
}
