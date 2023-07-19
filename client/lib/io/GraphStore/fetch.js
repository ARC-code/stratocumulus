const stream = require('../stream')
const graphology = require('graphology')
const updateGraph = require('./model/updateGraph')

module.exports = function (context) {
  // Start fetching a graph with the given context.
  // Listens stream events.
  //

  const key = context.toCacheKey()
  const path = context.toFacetPath()

  if (this.loading[key]) {
    // Already loading. Prevent duplicate build jobs.
    return
  }

  // Not yet loading. Do we have the graph already?
  if (this.graphs[key]) {
    // Complete cached graph exists.
    setTimeout(() => {
      this.emit(path, {
        cacheKey: key,
        path,
        context,
        first: true,
        final: true,
        updateCount: 0
      })
    }, 0)

    return
  }
  // Assert: the graph is not cached OR its filter is not cached.

  // Mark that the graph is loading.
  this.loading[key] = true
  this.updates[key] = 0

  // Start loading.
  // Get all years to prevent caching only subset of time ranges.
  const buildContext = context.remove('r_years')
  stream.sendStratumBuildJob(path, buildContext)

  // Start listening the stream.
  // Prevent duplicated listening by removing other listeners beforehand.
  stream.off(path)
  stream.on(path, (subgraph) => {
    // Get the graph to update. Create if not yet existing.
    let graph = this.graphs[key]
    if (!graph) {
      graph = new graphology.Graph()
      this.graphs[key] = graph
    }

    // Update the model and detect if had its first content.
    const wasEmpty = (graph.order === 0)
    updateGraph(graph, subgraph)
    const stillEmpty = (graph.order === 0)

    // Populate the label store using the facet nodes.
    subgraph.nodes.forEach(n => {
      if (n.facet_param && n.facet_value && n.label) {
        this.labelStore.write(n.facet_param, n.facet_value, n.label)
      }
    })

    // Detect when has some content.
    // Implies that the graph has content to render.
    const wasFirst = wasEmpty && !stillEmpty
    // Detect when final message i.e. graph is complete.
    // Implies that the graph is stable.
    const isFinal = ('stage' in subgraph && subgraph.stage === 'final')

    // Track number of graph updates.
    this.updates[key] += 1

    // Mark that loading is finished.
    // Note: do not reset update counter here. Maybe useful.
    if (isFinal) {
      delete this.loading[key]
    }

    this.emit(path, {
      cacheKey: key,
      path: path,
      context: context,
      first: wasFirst,
      final: isFinal,
      updateCount: this.updates[key]
    })
  })
}
