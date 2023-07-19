const normalizeSizes = require('./layout/normalizeSizes')

module.exports = function () {
  // Refresh the node sizes. Does not change layout.
  //

  if (!this.alive) {
    // Already removed, no need to refresh.
    return
  }

  normalizeSizes(this.graph)

  // Render nodes again.
  this.graph.forEachNode((key, attrs) => {
    const stratumNode = this.renderedNodes[key]

    if (stratumNode) {
      // Update size and scale according to attributes.
      stratumNode.render(attrs)
    }
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
      // Move edge to position
      const sourceRadius = sourceNode.getRadius()
      const targetRadius = targetNode.getRadius()
      edgeItem.trimPoints(
        sourceNode.getOrigin(),
        targetNode.getOrigin(),
        sourceRadius,
        targetRadius
      )

      // Allow node-size dependent edge styling.
      if (targetNode.component.hasClass('empty-node')) {
        edgeItem.addClass('empty-edge')
      } else {
        edgeItem.removeClass('empty-edge')
      }
    }
    // else no such nodes exist. Skip edge.
  })
}
