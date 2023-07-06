const normalizeSizes = require('./layout/normalizeSizes')

module.exports = function () {
  // Refresh the node sizes. Does not change layout.
  //

  if (!this.alive) {
    // Already removed, no need to refresh.
    return
  }

  // Map each node in graph model to a visible tapspace item.
  this.graph.forEachNode((key, attrs) => {
    const stratumNode = this.renderedNodes[key]

    if (stratumNode) {
      // Update size and scale according to attributes.
      stratumNode.updateCount(attrs)
    }
  })

  normalizeSizes(this.graph)

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
        sourceNode.getOrigin(),
        targetNode.getOrigin(),
        sourceRadius,
        targetRadius
      )
    }
    // else no such nodes exist. Skip edge.
  })
}
