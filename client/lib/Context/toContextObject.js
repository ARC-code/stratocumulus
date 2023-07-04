module.exports = function () {
  // @Context:toContextObject()
  //
  // Get as a plain context object.
  // If the context has duplicate keys, their values are joined with '__'.
  // Note that a plain object does not maintain the key order.
  //
  // Return
  //   an object
  //
  return this.keys.reduce((acc, k, i) => {
    if (acc[k]) {
      // Key already exist. Merge.
      acc[k] = acc[k] + '__' + this.values[i]
    } else {
      acc[k] = this.values[i]
    }
    return acc
  }, {})
}
