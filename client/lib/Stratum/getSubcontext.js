module.exports = function (subpath) {
  // Get faceting context for a substratum.
  //
  // Parameters:
  //   subpath
  //     a string, the substratum path
  //
  // Return:
  //   a StratumContext
  //

  const superContext = this.context
  const subNodeAttrs = this.graph.getNodeAttributes(subpath)

  if (!subNodeAttrs) {
    throw new Error('Cannot retrieve context for substratum: unknown node')
  }

  const facetParam = subNodeAttrs.facetParam
  const facetValue = subNodeAttrs.facetValue

  const subContext = Object.assign({}, superContext)

  // Build the faceting context for the substratum.
  // The node narrows the context by its facetParam and facetValue
  // TODO maybe avoid split-join logic. Join and split in the io module?
  // The '__' in value corresponds to AND operator.
  if (subContext[facetParam]) {
    const currentValues = subContext[facetParam].split('__')

    if (!currentValues.includes(facetValue)) {
      currentValues.push(facetValue)
    }
    subContext[facetParam] = currentValues.join('__')
  } else {
    subContext[facetParam] = facetValue
  }

  return subContext
}
