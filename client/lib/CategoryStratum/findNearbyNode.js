module.exports = function (viewport) {
  // @CategoryStratum:findNearbyNode(viewport)
  //
  // Find a stratum node close to viewport. The result can be null.
  //

  const nodes = this.getNodes()

  // The current node must have viewport center inside it.
  const pin = viewport.atCenter()
  const pinnedNodes = nodes.filter(stratumNode => {
    const circle = stratumNode.component.getBoundingCircle()
    return circle.detectCollision(pin)
  })

  // The current node must be visually large.
  const viewportArea = viewport.getBoundingBox().getArea().getRaw()
  const reachableNodes = pinnedNodes.filter(stratumNode => {
    const circle = stratumNode.component.getBoundingCircle()
    const area = circle.getArea().transitRaw(viewport)
    const areaRatio = area / viewportArea
    return areaRatio > 0.1
  })

  // The current node must be facetable.
  const facetNodes = reachableNodes.filter(n => n.isFacetNode)

  if (facetNodes.length > 0) {
    return facetNodes[0]
  }

  return null
}
