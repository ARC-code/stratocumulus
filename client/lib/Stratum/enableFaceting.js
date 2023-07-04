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
    const nodeAttrs = this.graph.getNodeAttributes(nodeKey)

    const facetParam = nodeAttrs.facetParam
    const facetValue = nodeAttrs.facetValue

    // Skip non-facetable nodes.
    if (!facetParam || !facetValue) {
      return
    }

    this.emit('substratumrequest', {
      context: this.context.append(facetParam, facetValue),
      nodeKey: nodeKey
    })
  })
}
