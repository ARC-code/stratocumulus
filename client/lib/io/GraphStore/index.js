const emitter = require('component-emitter')

const GraphStore = function () {
  // @GraphStore
  //
  // Emits path events.
  //

  // Store graphs here. Structure:
  // stratumPath -> a graphology Graph
  this.graphs = {}

  // Track graph loading state to prevent duplicate loading.
  // TODO MAYBE separately track populating and filtering kind of loading.
  // TODO MAYBE store this to graph attributes instead.
  this.loading = {}

  // Graphs have states:
  // initial -> partial -> complete
  // complete -> filtering -> complete
  // partial -> filtering -> partial
}

module.exports = GraphStore
const proto = GraphStore.prototype

// Inherit
emitter(proto)

proto.fetch = require('./fetch')
proto.get = require('./get')
