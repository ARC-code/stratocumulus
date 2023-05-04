module.exports = function () {
  // Refresh the layout
  //
  if (!this.alive) {
    // Already removed, no need to refresh anything.
    return
  }

  // Map each node in graph model to a visible tapspace item.
  this.graph.forEachNode((key, attrs) => {
    let stratumNode = this.renderedNodes[key]

    if (!stratumNode) {
      // Node does not exist. Skip
      return
    }

    // Update size and scale according to attributes.
    stratumNode.updateCount(attrs)
  })
}
