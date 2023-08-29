module.exports = function (param, value) {
  // @Context:hasValue(param, value)
  //
  // Return
  //   boolean
  //
  const i = this.keys.indexOf(param)
  if (i >= 0) {
    // Key exists
    if (this.values[i] === value) {
      return true
    }
  }
  return false
}
