const emitter = require('component-emitter')

const GraphStore = function (labelStore) {
  // @GraphStore
  //
  // Emits:
  //   path
  //     event with object
  //       cacheKey
  //         a string, a cache key
  //       path
  //         a string, a facet path
  //       context
  //         a Context
  //       first
  //         a boolean
  //       final
  //         a boolean
  //       updateCount
  //         an integer, number of updates during this load.
  //
  // Parameters:
  //   labelStore
  //     a LabelStore. Graph store is responsible of populating the label store
  //

  // Store graphs here. Structure:
  // cacheKey -> a graphology Graph
  this.graphs = {}

  // Track graph loading state to prevent duplicate loading.
  // TODO MAYBE separately track populating and filtering kind of loading.
  // TODO MAYBE store this to graph attributes instead.
  this.loading = {}

  // Keep track of how many updates it took before final. Reset at reload.
  // Useful for layout adjustment timing.
  // cacheKey -> integer
  this.updates = {}

  // Track which graphs are finished loading
  // cacheKey -> boolean
  this.completed = {}

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
proto.unsubscribe = require('./unsubscribe')
proto.subscribe = require('./subscribe')
proto.provide = require('./provide')
