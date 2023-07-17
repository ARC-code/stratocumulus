const graphology = require('graphology')

module.exports = function (path, context) {
  // Get current local graph of given facet path.
  // Return empty graph if not yet available.
  // The returned graph is meant for read-only use.
  //
  // Return
  //   a graphology Graph.
  //

  const graph = this.graphs[path]

  if (!graph) {
    return new graphology.Graph()
  }

  // TODO if context has r_years query, filter the graph.
  // Use graphology export-import?

  return graph
}
