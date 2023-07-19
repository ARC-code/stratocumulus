const findLastFacetIndex = require('./model/findLastFacetIndex')

module.exports = function () {
  // @Context:toNodeKey()
  //
  // Take the last faceting property and build a node key from it.
  //
  // Return
  //   a string, for example "/arc/disciplines/1234"
  //

  // Find last faceting parameter.
  const last = findLastFacetIndex(this.keys)
  if (last < 0) {
    // No faceting parameters found.
    console.warn('Not enough context to build node keys.')
    return '/'
  }

  const key = this.keys[last]
  const value = this.values[last]

  let simpleKey = key
  const match = key.match(/^f_([a-z0-9]+).id$/i)
  if (match && match[1]) {
    simpleKey = match[1]
  }

  const canonValue = value.toLowerCase()

  return '/arc/' + simpleKey + '/' + canonValue
}
