module.exports = function () {
  // Get the context of each substrata.
  //
  // Return
  //   an array of Context.
  //

  const subctxs = []

  this.graph.forEachNode((key, attrs) => {
    if (attrs.isFacetable) {
      const subctx = this.context.append(attrs.facetParam, attrs.facetValue)
      subctxs.push(subctx)
    }
  })

  return subctxs
}
