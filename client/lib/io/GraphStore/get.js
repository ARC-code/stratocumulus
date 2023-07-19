const graphology = require('graphology')

module.exports = function (context) {
  // Get current local graph for the given context.
  // Return empty graph if not yet available.
  // The returned graph is meant for read-only use.
  //
  // Return
  //   a graphology Graph.
  //

  const key = context.toCacheKey()
  const graph = this.graphs[key]

  if (!graph) {
    return new graphology.Graph()
  }

  // TODO if context has r_years query, filter the graph.
  // Use graphology export-import?

  return graph
}
