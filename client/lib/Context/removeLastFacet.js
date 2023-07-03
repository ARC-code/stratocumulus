module.exports = function () {
  // @Context:removeLastFacet()
  //
  // Remove the last faceting parameter, if any. Creates a new Context.
  // Useful for building superstratum context.
  //
  // Return
  //   a Context.
  //

  // Find last faceting parameter.
  const len = this.keys.length
  let last = -1
  for (let i = 0; i < len; i += 1) {
    if (this.keys[i].startsWith('f_')) {
      last = i
    }
  }

  if (last < 0) {
    // No faceting parameters found.
    return this.copy()
  }
  const lastKey = this.keys[last]

  // Find last value of the parameter.
  const value = this.values[last]
  const parts = value.split('__')
  const lastValue = parts[parts.length - 1]

  return this.remove(lastKey, lastValue)
}
