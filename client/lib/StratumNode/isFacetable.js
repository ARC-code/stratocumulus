module.exports = function () {
  // Check if the node kind allows it to be faceted at some point in time.
  //
  // Return
  //   a boolean
  //
  return this.attributesCache.isFacetable
}
