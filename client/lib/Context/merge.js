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

  const ctxa = this.ctx
  const ctxb = ctx.plain()

  const keysa = Object.keys(ctxa)
  const keysb = Object.keys(ctxb)

  const result = {}

  keysa.forEach(ka => {
    if (ctxb[ka]) {
      // B has same parameter
      if (ctxa[ka] && ctxa[ka].length > 0) {
        if (ctxb[ka].length > 0 && ctxa[ka] !== ctxb[ka]) {
          // A and B valid and not equal.
          result[ka] = ctxa[ka] + '__' + ctxb[ka]
        } else {
          // B empty or equal, use just A
          result[ka] = ctxa[ka]
        }
      } else {
        if (ctxb[ka].length > 0) {
          // A empty, B not empty, use just B
          result[ka] = ctxb[ka]
        }
      }
    } else {
      // B does not have the parameter.
      if (ctxa[ka] && ctxa[ka].length > 0) {
        // A not empty, use just A.
        result[ka] = ctxa[ka]
      }
    }
  })

  keysb.forEach(kb => {
    // Skip if same key cuz already merged.
    if (!ctxa[kb]) {
      // Copy
      if (ctxb[kb] && ctxb[kb].length > 0) {
        // B not empty, just use B
        result[kb] = ctxb[kb]
      }
    }
  })

  const Context = this.constructor
  return new Context(result)
}
