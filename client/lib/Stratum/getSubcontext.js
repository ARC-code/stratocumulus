module.exports = function (nodeKey) {
  // Get faceting context for a substratum.
  //
  // Parameters:
  //   nodeKey
  //     a string, a facet node key.
  //
  // Return:
  //   a Context
  //

  // TODO maybe build this in each node once?

  if (!this.graph.hasNode(nodeKey)) {
    throw new Error('Unknown stratum node: ' + nodeKey)
  }

  const attrs = this.graph.getNodeAttributes(nodeKey)

  if (!attrs.isFacetable) {
    throw new Error('Unexpected non-facetable stratum node: ' + nodeKey)
  }

  const facetParam = attrs.facetParam
  const facetValue = attrs.facetValue
  const subcontext = this.context.append(facetParam, facetValue)

  return subcontext
}
