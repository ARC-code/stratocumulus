const findLastFacetIndex = require('./model/findLastFacetIndex')
const parameterToKind = require('./model/parameterToKind')

module.exports = function () {
  // @Context:getLastFacet()
  //
  // Get the last faceting property as an object.
  //
  // Return
  //   an object { parameter, value } or null if empty
  //

  // Find last faceting parameter.
  const last = findLastFacetIndex(this.keys)
  if (last < 0) {
    // No faceting parameters found.
    return null
  }

  const parameter = this.keys[last]
  const value = this.values[last]
  const type = parameter.substring(0, 1)
  const kind = parameterToKind(parameter) // genre, disciplines, federations

  return { parameter, value, type, kind }
}
