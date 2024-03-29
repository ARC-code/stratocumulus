const findLastFacetIndex = require('./model/findLastFacetIndex')

module.exports = function () {
  // @Context:removeLastFacet()
  //
  // Remove the last faceting parameter, if any.
  // Faceting parameters are keys beginning with 'f_'
  // Useful for building broader context step by step.
  // Creates a new Context.
  //
  // Return
  //   a Context.
  //

  // Find last faceting parameter.
  const last = findLastFacetIndex(this.keys)

  if (last < 0) {
    // No faceting parameters found.
    return this.copy()
  }

  const keys = this.keys.slice(0)
  const values = this.values.slice(0)

  keys.splice(last, 1)
  values.splice(last, 1)

  const Context = this.constructor
  return new Context(keys, values)
}
