module.exports = function () {
  // Enable stratum faceting.
  // In other words, detect facetable nodes
  // and make them interactive.
  //

  // Construct click handler once for all the nodes.
  const onRequest = (ev) => {
    this.openNode(ev.nodeKey)
  }

  const nodeKeys = Object.keys(this.renderedNodes)
  const facetableKeys = nodeKeys.filter(nodeKey => {
    return this.graph.getNodeAttribute(nodeKey, 'isFacetable')
  })

  facetableKeys.forEach(nodeKey => {
    const stratumNode = this.renderedNodes[nodeKey]
    stratumNode.enableFaceting()
    stratumNode.on('openingrequest', onRequest)
  })
}
