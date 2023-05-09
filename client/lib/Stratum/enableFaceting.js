module.exports = function () {
  // Enable stratum faceting.
  // In other words, detect facetable nodes
  // and make them interactive.
  //

  // Construct click handler once for all the nodes.
  const onTap = (event) => {
    const targetItem = event.component
    const targetKey = targetItem.nodeKey

    this.openNode(targetKey)

    // Zoom closer to the node
    const viewport = this.space.getViewport()
    const goalScale = targetItem.getScale().scaleBy(0.62)
    viewport.animateOnce({ duration: '1.5s' })
    viewport.translateTo(targetItem.atCenter())
    viewport.setScale(goalScale, targetItem.atCenter())
  }

  const nodeKeys = Object.keys(this.renderedNodes)

  const facetableKeys = nodeKeys.filter(nodeKey => {
    return this.graph.getNodeAttribute(nodeKey, 'isFacetable')
  })

  facetableKeys.forEach(nodeKey => {
    const stratumNode = this.renderedNodes[nodeKey]
    stratumNode.enableFaceting(onTap)
  })
}
