module.exports = function () {
  // Get the context of each substrata.
  //
  // Return
  //   an array of Context.
  //

  const subctxs = []

  this.getNodes().forEach((node) => {
    if (node.isFacetable) {
      const subctx = this.context.append(node.facetParam, node.facetValue)
      subctxs.push(subctx)
    }
  })

  return subctxs
}
