module.exports = function (subcontext) {
  // Get a node by its subcontext. Can be null if no node found.
  //
  // Parameters:
  //   subcontext
  //     a Context. The subcontext of the node.
  //
  // Return
  //   a CategoryNode or null
  //

  // TODO build more flexible way to load pages and other content.

  const subPageNumber = parseInt(subcontext.getValue('page'))
  const pageNumber = parseInt(this.context.getValue('page'))
  if (pageNumber !== subPageNumber - 1) {
    return null
  }

  const nodes = Object.values(this.renderedNodes)
  const lastNode = nodes.find(n => {
    return n.isLast
  })

  if (lastNode) {
    return lastNode
  }

  return null
}
