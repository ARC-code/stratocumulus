// Mock of the stream module for offline-development

const Emitter = require('component-emitter')
const fixture = require('./streamMockFixture')

// Use only one stream; the singleton pattern.
let graphStream = null

// Keep track what paths we listen.
const pathEmitter = new Emitter()


exports.connect = function () {
  // Open a SSE stream and begin to listen to events.
  //
  if (graphStream) {
    // Stream already started. No need to restart.
    return
  }

  graphStream = new Emitter()
  graphStream.on('mock-event', (ev) => {
    const data = JSON.parse(ev.data)
    // DEBUG
    const msg = `${data.stage} for '${data.path}' ` +
      `(edges:${data.edges.length}, nodes:${data.nodes.length})`
    console.log('Incoming SSE event: ' + msg)

    // Stratum path
    const path = data.path

    if (pathEmitter.hasListeners(path)) {
      pathEmitter.emit(path, data)
    }
  })
}

exports.on = function (path, handler) {
  if (typeof path !== 'string') {
    throw new Error('Invalid path event to listen: ' + path)
  }
  if (typeof handler !== 'function') {
    throw new Error('Invalid path event handler function: ' + handler)
  }

  pathEmitter.on(path, handler)
}

exports.off = function (path, handler) {
  if (typeof path !== 'string') {
    throw new Error('Invalid path to unregister: ' + path)
  }

  pathEmitter.off(path, handler)
}

exports.sendStratumBuildJob = function (path, context) {
  if (!graphStream) {
    throw new Error('No stream available.')
  }

  // DEBUG
  const msg = `get '${path}' with context ${JSON.stringify(context)}`
  console.log('Outgoing request: ' + msg)

  setTimeout(() => {
    const responseData = fixture[path]
    if (responseData) {
      const responseEvent = { data: responseData }
      graphStream.emit('mock-event', responseEvent)
    }
  }, 2000)
}
