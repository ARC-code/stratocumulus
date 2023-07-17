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

  // Not yet loading. Do we have the graph already?
  if (this.graphs[path]) {
    if (context.hasParameter('q')) {
      const keyword = context.getValue('q')
      // Do we have this keyword already cached?
      const graph = this.graphs[path]
      if (graph.hasAttribute('cachedKeywords')) {
        const cachedKeywords = graph.getAttribute('cachedKeywords')
        if (cachedKeywords && cachedKeywords.includes(keyword)) {
          // The keyword query is already cached.
          const first = true
          const final = true
          setTimeout(() => {
            this.emit(path, { path, context, first, final })
          }, 0)

          return
        }
      }
    } else {
      // Complete graph exists. No keyword filters. TODO
      const first = true
      const final = true
      setTimeout(() => {
        this.emit(path, { path, context, first, final })
      }, 0)

      return
    }
  }
  // Assert: the graph is not cached OR its filter is not cached.

  // Mark that the graph is loading.
  this.loading[path] = true

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

    // Mark the filtering context to nodes in order to know
    // which were included by the filter.
    if (context.hasParameter('q') && context.getValue('q').length > 0) {
      const keywords = [context.getValue('q')]

      subgraph.nodes.forEach(n => {
        n.keywords = keywords // Joined in mergeNodeAttributes.
      })
      // Mark also the subgraph. Joined in updateGraph.
      subgraph.cachedKeywords = keywords
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
