module.exports = function () {
  // @Context:toContextObject()
  //
  // Get as a plain context object.
  // Note that a plain object does not maintain the key order.
  //
  // Return
  //   an object
  //
  return this.keys.reduce((acc, k, i) => {
    acc[k] = this.values[i]
    return acc
  }, {})
}
