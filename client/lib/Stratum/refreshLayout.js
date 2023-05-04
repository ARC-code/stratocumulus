const layoutGraph = require('./layout')

module.exports = function () {
  // Refresh the layout
  //
  if (!this.alive) {
    // Already removed, no need to refresh.
    return
  }

  // Compute layout
  const layoutPositions = layoutGraph(this.graph, this.context)
  const stratumOrigin = this.space.at(0, 0)

  // Map each node in graph model to a visible tapspace item.
  this.graph.forEachNode((key, attrs) => {
    const stratumNode = this.renderedNodes[key]

    if (!stratumNode) {
      // Node does not exist. Skip.
      return
    }

    // Update position according to the layout.
    const nPosition = layoutPositions[key]
    const nPoint = stratumOrigin.offset(nPosition.x, nPosition.y)

    stratumNode.translateTo(nPoint)
  })

  this.graph.forEachEdge((edgeKey, edgeAttrs, sourceKey, targetKey) => {
    const edgeItem = this.renderedEdges[edgeKey]

    if (!edgeItem) {
      // No such edge yet rendered. Skip.
      return
    }

    // Move edge to position. We need the nodes.
    const sourceNode = this.renderedNodes[sourceKey]
    const targetNode = this.renderedNodes[targetKey]

    // Ensure both exists and are affine
    if (sourceNode && targetNode) {
      const sourceRadius = sourceNode.getRadius()
      const targetRadius = targetNode.getRadius()
      edgeItem.trimPoints(
        sourceNode.atAnchor(),
        targetNode.atAnchor(),
        sourceRadius,
        targetRadius
      )
    }
    // else no such nodes exist. Skip edge.
  })
}
