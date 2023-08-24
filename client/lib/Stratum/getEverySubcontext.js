module.exports = function () {
  // Get the context of each substrata.
  //
  // Return
  //   an array of Context.
  //

  const subcontexts = []

  const nodeKeys = Object.keys(this.renderedNodes)
  const len = nodeKeys.length

  for (let i = 0; i < len; i += 1) {
    const subctx = this.getSubcontext(nodeKeys[i])
    if (subctx) {
      subcontexts.push(subctx)
    }
  }

  return subcontexts
}
