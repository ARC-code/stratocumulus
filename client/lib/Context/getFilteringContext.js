const config = require('../config')

module.exports = function () {
  // @Context:getFilteringContext()
  //
  // Get a subset of this context that includes only filtering parameters.
  //
  // Return
  //   a Context
  //

  // Pick filters
  const keys = []
  const values = []
  const len = this.keys.length
  for (let i = 0; i < len; i += 1) {
    const key = this.keys[i]
    if (config.filterParameters.includes(key)) {
      keys.push(key)
      values.push(this.values[i])
    }
  }

  // Sort consistently
  const orderedKeys = []
  const orderedValues = []
  config.filterParameters.forEach(fkey => {
    const i = keys.indexOf(fkey)
    if (i >= 0) {
      orderedKeys.push(fkey)
      orderedValues.push(values[i])
    }
  })

  const Context = this.constructor
  return new Context(orderedKeys, orderedValues)
}
