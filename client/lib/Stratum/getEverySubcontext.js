module.exports = function () {
  // @Stratum:getEverySubcontext()
  //
  // Get the context of each substrata.
  //
  // Return
  //   an array of Context.
  //

  const subcontexts = []

  const nodes = Object.values(this.renderedNodes)
  const len = nodes.length

  for (let i = 0; i < len; i += 1) {
    try {
      const subctx = this.getSubcontext(nodes[i])
      if (subctx) {
        subcontexts.push(subctx)
      }
    } catch (err) {
      // Some values might be null and throw an error. Skip them.
      console.error(err)
    }
  }

  return subcontexts
}
