const stream = require('../stream')
const graphology = require('graphology')
const updateGraph = require('./model/updateGraph')

module.exports = function (context) {
  // Start fetching a graph with the given context.
  // Listens stream events.
  //

  const path = context.toCacheKey()

  if (this.loading[path]) {
    // Already loading. Prevent duplicate build jobs.
    // TODO check if the context is stricter.
    return
  }

  // Not yet loading. Do we have the graph already?
  if (this.graphs[path]) {
    // Complete cached graph exists.
    const first = true
    const final = true
    const updateCount = 0
    setTimeout(() => {
      this.emit(path, { path, context, first, final, updateCount })
    }, 0)

    return
  }
  // Assert: the graph is not cached OR its filter is not cached.

  // Mark that the graph is loading.
  this.loading[path] = true
  this.updates[path] = 0

  // Start loading.
  stream.sendStratumBuildJob(path, context)

  // Start listening the stream.
  // Prevent duplicated listening by removing other listeners beforehand.
  stream.off(path)
  stream.on(path, (subgraph) => {
    // Get the graph to update. Create if not yet existing.
    let graph = this.graphs[path]
    if (!graph) {
      graph = new graphology.Graph()
      this.graphs[path] = graph
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
    this.updates[path] += 1

    // Mark that loading is finished.
    // Note: do not reset update counter here. Maybe useful.
    if (isFinal) {
      delete this.loading[path]
    }

    this.emit(path, {
      path: path,
      context: context,
      first: wasFirst,
      final: isFinal,
      updateCount: this.updates[path]
    })
  })
}
