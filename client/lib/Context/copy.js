module.exports = function () {
  // @Context:copy()
  //
  // Clone the context.
  //
  // Return
  //   a Context
  //
  const Context = this.constructor
  const keys = this.keys.slice(0)
  const values = this.values.slice(0)
  return new Context(keys, values)
}
