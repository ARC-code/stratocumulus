module.exports = function () {
  // Get faceting context for the superstratum.
  // Basically takes the stratum context, and returns a new context
  // with the last faceting parameter removed.
  //
  // Return
  //   a Context
  //
  return this.context.removeLastFacet()
}
