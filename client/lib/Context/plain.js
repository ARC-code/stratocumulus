module.exports = function () {
  // @Context:plain()
  //
  // Get plain context object.
  //
  // Return
  //   an object
  //
  return this.keys.reduce((acc, k, i) => {
    acc[k] = this.values[i]
    return acc
  }, {})
}
