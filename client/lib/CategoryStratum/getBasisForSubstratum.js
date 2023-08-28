module.exports = function (subcontext) {
  // @CategoryStratum:getBasisForSubstratum(subcontext)
  //
  // Overrides Stratum:getBasisForSubstratum
  //
  // The method returns a basis for the given subcontext.
  // The basis equals the basis of the facet node that
  // represents the substratum.
  //
  // Parameters:
  //   subcontext
  //     a Context
  //
  // Returns:
  //   a tapspace.geometry.Basis or null if no basis found for the subcontext.
  //

  const facet = subcontext.remove('page').getLastFacet()
  const facetParam = facet.parameter
  const facetValue = facet.value

  const nodes = Object.values(this.renderedNodes)
  const facetNode = nodes.find(n => {
    return n.data.facetParam === facetParam && n.data.facetValue === facetValue
  })

  if (!facetNode) {
    const msg = facetParam + '=' + facetValue
    console.warn('Unknown or non-existing facet node: ' + msg)
    return null
  }

  const childBasis = facetNode.component.getBasis()

  // Nodes have constant rendering size that is 10th of stratum size.
  return childBasis.scaleBy(0.1, facetNode.component.at(0, 0))
}
