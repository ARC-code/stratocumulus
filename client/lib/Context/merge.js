module.exports = function (ctx) {
  // @Context:merge(ctx)
  //
  // Merge with another context.
  //
  // Parameters:
  //   ctx
  //     a Context
  //
  // Return
  //   a Context
  //

  const aKeys = this.keys
  const aValues = this.values
  const bKeys = ctx.keys
  const bValues = ctx.values

  // Results
  const rKeys = aKeys.concat(bKeys)
  const rValues = aValues.concat(bValues)

  const Context = this.constructor
  return new Context(rKeys, rValues)
}
