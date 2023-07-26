const config = require('../config')

module.exports = function () {
  // @Context:getFacetingContext()
  //
  // Get a subset of this context that includes only non-filter parameters.
  //
  // Return
  //   a Context
  //

  // Pick facets
  const keys = []
  const values = []
  const len = this.keys.length
  for (let i = 0; i < len; i += 1) {
    const key = this.keys[i]
    if (config.facetParameters.includes(key)) {
      keys.push(key)
      values.push(this.values[i])
    }
  }

  const Context = this.constructor
  return new Context(keys, values)
}
