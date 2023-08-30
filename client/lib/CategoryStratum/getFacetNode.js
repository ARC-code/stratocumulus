module.exports = function (subcontext) {
  // @CategoryStratum:getFacetNode(subcontext)
  //
  // Get a node by its subcontext. Can be null if no node found.
  //
  // Parameters:
  //   subcontext
  //     a Context. The subcontext of the node.
  //
  // Return
  //   a CategoryNode or null
  //

  const facet = subcontext.remove('page').getLastFacet()
  const facetParam = facet.parameter
  const facetValue = facet.value

  const nodes = Object.values(this.renderedNodes)
  const facetNode = nodes.find(n => {
    return n.data.facetParam === facetParam && n.data.facetValue === facetValue
  })

  if (!facetNode) {
    return null
  }

  return facetNode
}
