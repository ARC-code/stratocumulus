const emitter = require('component-emitter')

const GraphStore = function (labelStore) {
  // @GraphStore
  //
  // Emits path events.
  //
  // Parameters:
  //   labelStore
  //     a LabelStore. Graph store is responsible of populating the label store
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

  // Populate label store using node labels
  this.labelStore = labelStore
}

module.exports = GraphStore
const proto = GraphStore.prototype

// Inherit
emitter(proto)

proto.fetch = require('./fetch')
proto.get = require('./get')
proto.provide = require('./provide')
