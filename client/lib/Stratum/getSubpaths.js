module.exports = function () {
  // Get the paths of substrata.
  // Basically returns the IDs of the facetable nodes.
  //
  // Return
  //   an array of string.
  //

  return this.graph.filterNodes((key, attrs) => {
    return attrs.isFacetable
  })
}
