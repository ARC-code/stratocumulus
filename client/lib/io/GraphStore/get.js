const graphology = require('graphology')

module.exports = function (context) {
  // @GraphStore:get(context)
  //
  // Get current local graph for the given context.
  // Return empty graph if not yet available.
  // The returned graph is meant for read-only use.
  //
  // Parameters:
  //   context
  //     a Context
  //
  // Return
  //   a graphology.Graph.
  //

  const key = context.toCacheKey()
  const graph = this.graphs[key]

  if (!graph) {
    return new graphology.Graph()
  }

  return graph
}
