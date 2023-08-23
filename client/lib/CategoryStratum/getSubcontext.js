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

  // TODO maybe build this in each CategoryNode once?

  if (!this.renderedNodes[nodeKey]) {
    throw new Error('Unknown stratum node: ' + nodeKey)
  }

  const node = this.renderedNodes[nodeKey]

  if (!node.isFacetable) {
    throw new Error('Unexpected non-facetable stratum node: ' + nodeKey)
  }

  const facetParam = node.facetParam
  const facetValue = node.facetValue
  const subcontext = this.context.append(facetParam, facetValue)

  return subcontext
}
