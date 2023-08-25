module.exports = function () {
  // Get the context of each substrata.
  //
  // Return
  //   an array of Context.
  //

  const subcontexts = []

  const nodes = Object.values(this.renderedNodes)
  const len = nodes.length

  for (let i = 0; i < len; i += 1) {
    const subctx = this.getSubcontext(nodes[i])
    if (subctx) {
      subcontexts.push(subctx)
    }
  }

  return subcontexts
}
