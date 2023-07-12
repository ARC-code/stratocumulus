const stream = require('../stream')
const graphology = require('graphology')
const updateGraph = require('./model/updateGraph')

module.exports = function (path, context) {
  // Start fetching a graph with the given context.
  // Listen events "updated".
  //

  // TODO create path from context

  if (this.loading[path]) {
    // Already loading. Prevent duplicate build jobs.
    // TODO check if the context is stricter.
    return
  }
  // Mark that the graph is loading.
  this.loading[path] = true

  // Start loading.
  stream.sendStratumBuildJob(path, context)

  // TODO prevent re-listening if already listening
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

    // Detect when has some content.
    // Implies that the graph has content to render.
    const wasFirst = wasEmpty && !stillEmpty
    // Detect when final message i.e. graph is complete.
    // Implies that the graph is stable.
    const isFinal = ('stage' in subgraph && subgraph.stage === 'final')

    // Mark that loading is finished.
    if (isFinal) {
      delete this.loading[path]
    }

    this.emit(path, {
      path: path,
      context: context,
      first: wasFirst,
      final: isFinal
    })
  })
}