module.exports = function () {
  // Get the paths of substrata.
  //
  // Return
  //   an array of string.
  //

  // TODO maybe compute just once in StratumNode?

  const subpaths = []

  this.graph.forEachNode((key, attrs) => {
    if (attrs.isFacetable) {
      const subctx = this.context.append(attrs.facetParam, attrs.facetValue)
      subpaths.push(subctx.toFacetPath())
    }
  })

  return subpaths
}
