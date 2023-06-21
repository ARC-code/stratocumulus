module.exports = (sky, stratum) => {
  // Find the current stratum node. Can be null.
  //

  const nodes = stratum.getNodes()

  // The current node must have viewport center inside it.
  const pin = sky.viewport.atCenter()
  const pinnedNodes = nodes.filter(stratumNode => {
    const circle = stratumNode.component.getBoundingCircle()
    return circle.detectCollision(pin)
  })

  // The current node must be visually large.
  const viewportArea = sky.viewport.getBoundingBox().getArea().getRaw()
  const reachableNodes = pinnedNodes.filter(stratumNode => {
    const circle = stratumNode.component.getBoundingCircle()
    const area = circle.getArea().transitRaw(sky.viewport)
    const areaRatio = area / viewportArea
    return areaRatio > 0.1
  })

  // The current node must be facetable.
  const facetableNodes = reachableNodes.filter(n => n.isFacetable())

  if (facetableNodes.length > 0) {
    return facetableNodes[0]
  }

  return null
}
