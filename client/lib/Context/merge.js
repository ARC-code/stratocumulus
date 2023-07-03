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
  const rKeys = []
  const rValues = []

  aKeys.forEach((aKey, ai) => {
    const bi = bKeys.indexOf(aKey)
    if (bi >= 0) {
      // B has same parameter.
      if (aValues[ai] && aValues[ai].length > 0) {
        if (bValues[bi] && bValues[bi].length > 0 &&
            aValues[ai] !== bValues[bi]) {
          // A and B valid and not equal.
          rKeys.push(aKey)
          rValues.push(aValues[ai] + '__' + bValues[bi])
        } else {
          // B empty or equal, use just A
          rKeys.push(aKey)
          rValues.push(aValues[ai])
        }
      } else {
        if (bValues[bi].length > 0) {
          // A empty, B not empty, use just B
          rKeys.push(aKey)
          rValues.push(bValues[bi])
        }
      }
    } else {
      // B does not have the parameter.
      if (aValues[ai] && aValues[ai].length > 0) {
        // A not empty, use just A.
        rKeys.push(aKey)
        rValues.push(aValues[ai])
      }
    }
  })

  bKeys.forEach((bKey, bi) => {
    // Skip if same key cuz already merged.
    const ai = aKeys.indexOf(bKey)
    if (ai < 0) {
      // No key in A. Copy B.
      if (bValues[bi] && bValues[bi].length > 0) {
        // B not empty, just use B
        rKeys.push(bKey)
        rValues.push(bValues[bi])
      }
    }
  })

  const Context = this.constructor
  return new Context(rKeys, rValues)
}
