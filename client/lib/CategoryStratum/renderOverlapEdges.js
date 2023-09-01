const tapspace = require('tapspace')

module.exports = function (getOverlap) {
  // @CategoryStratum:renderOverlapEdges(getOverlap)
  //
  // EXPERIMENTAL
  //
  // Render edges between substrata to reveal their overlap.
  // Useful to inspect high overlap to design improved graph layouts.
  //
  // Parameters:
  //   getOverlap
  //     a function (facet0, facet1)
  //

  if (!this.overlapEdges) {
    this.overlapEdges = {}
  }

  // Draw overlap edges between open nodes.
  const facetedNodes = this.getNodes().filter(n => n.isFacetNode && n.isFaceted)
  const facetedNodePairs = facetedNodes.map((n, i, nodes) => {
    const pairs = []
    for (let j = i + 1; j < nodes.length; j += 1) {
      pairs.push([n, nodes[j]])
    }
    return pairs
  }).reduce((acc, pairs) => {
    return acc.concat(pairs)
  }, [])
  // Pairs to edges
  facetedNodePairs.forEach((pair) => {
    // Open the pair
    const sourceNode = pair[0]
    const targetNode = pair[1]

    // Check if exists
    const edgeKey = pair[0].key + ':' + pair[1].key
    let edgeItem = this.overlapEdges[edgeKey]
    if (!edgeItem) {
      // No such edge yet rendered. Create.
      edgeItem = tapspace.createEdge(3)
      edgeItem.addClass('stratum-overlap-edge')
      edgeItem.edgeKey = edgeKey

      // Label
      edgeItem.element.innerHTML = '1000'

      this.overlapEdges[edgeKey] = edgeItem
      this.edgePlane.addChild(edgeItem)
    }

    // Move edge to position.
    const scaler = 0.95 // ensure edge end goes under the node border.
    const sourceRadius = sourceNode.getRadius().scaleBy(scaler)
    const targetRadius = targetNode.getRadius().scaleBy(scaler)
    edgeItem.trimPoints(
      sourceNode.getOrigin(),
      targetNode.getOrigin(),
      sourceRadius,
      targetRadius
    )
  })
}
