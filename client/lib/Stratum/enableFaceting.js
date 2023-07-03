module.exports = function () {
  // Enable stratum faceting.
  // In other words, detect facetable nodes
  // and make them interactive.
  //

  const nodeKeys = Object.keys(this.renderedNodes)
  const facetableKeys = nodeKeys.filter(nodeKey => {
    return this.graph.getNodeAttribute(nodeKey, 'isFacetable')
  })

  facetableKeys.forEach(nodeKey => {
    const stratumNode = this.renderedNodes[nodeKey]
    stratumNode.enableFaceting()
  })

  this.space.element.addEventListener('openingrequest', (ev) => {
    const nodeKey = ev.detail

    this.emit('substratumrequest', {
      path: nodeKey
    })
  })
}
