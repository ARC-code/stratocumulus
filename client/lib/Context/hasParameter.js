module.exports = function (param) {
  // @Context:hasParameter(param)
  //
  const i = this.keys.indexOf(param)
  return i >= 0
}
