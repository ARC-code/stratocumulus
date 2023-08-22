module.exports = function (path) {
  // Get node by its substratum path. Can be null if no node found.
  //
  // Parameters:
  //   path
  //     a string, a facet path
  //
  // Return
  //   a CategoryNode or null
  //

  const nodeKey = this.facetNodeIndex[path]

  if (!nodeKey) {
    return null
  }

  const facetNode = this.renderedNodes[nodeKey]

  if (!facetNode) {
    return null
  }

  return facetNode
}
