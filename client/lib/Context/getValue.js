module.exports = function (param) {
  // @Context:getValue(param)
  //
  // Return first value of the given parameter. Null if not found.
  //
  const i = this.keys.indexOf(param)
  if (i >= 0) {
    return this.values[i]
  }
  return null
}
