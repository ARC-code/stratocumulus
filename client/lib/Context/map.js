module.exports = function (fn) {
  // @Context:map(fn)
  //
  // Map the context to an array.
  //
  // Parameters:
  //   fn
  //     a function (key, value) => any
  //
  // Return
  //   an array
  //

  const results = []
  const len = this.keys.length

  for (let i = 0; i < len; i += 1) {
    results.push(fn(this.keys[i], this.values[i]))
  }

  return results
}
