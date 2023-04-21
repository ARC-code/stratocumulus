module.exports = function (graph, context) {
  // Pick a node from the graph that matches the facet context.
  // Use this to find the node that acts as the root node.
  //
  // Parameters:
  //   graph
  //     a stratum graph
  //   context
  //     an object similar to { 'f_federations.id': '5f624...905' }
  //
  // Return
  //   a string, the key of the matching node. Null if no matching node found.
  //

  if (!context) {
    return null
  }

  const rootNode = graph.findNode((nodeKey, attrs) => {
    // Find the node that matches the context
    if (!attrs.facetParam || !attrs.facetValue) {
      return false
    }
    if (context[attrs.facetParam] === attrs.facetValue) {
      return true
    }
    return false
  })

  return rootNode
}
