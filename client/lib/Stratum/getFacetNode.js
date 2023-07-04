module.exports = function (path) {
  // Get node by its substratum path. Can be null if no node found.
  //
  // Parameters:
  //   path
  //     a string, a facet path
  //
  // Return
  //   a StratumNode or null
  //

  const nodeKey = this.facetNodeIndex[path]

  if (!nodeKey) {
    return null
  }

  const stratumNode = this.renderedNodes[nodeKey]

  if (!stratumNode) {
    return null
  }

  return stratumNode
}
