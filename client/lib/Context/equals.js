module.exports = function (ctx) {
  // @Context:equals(ctx)
  //
  // Test if two contexts are equal. Two context are equal if
  // they have the same parameters and values in same order.
  //
  // Parameters:
  //   ctx
  //     a Context
  //
  // Return
  //   a boolean
  //

  // Test for key and value equality.
  // Array every returns true for empty array, thus test also length equality.
  return this.keys.length === ctx.keys.length &&
    this.keys.every((k, i) => ctx.keys[i] === k) &&
    this.values.every((v, i) => ctx.values[i] === v)
}
