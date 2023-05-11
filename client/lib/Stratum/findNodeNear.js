module.exports = function (point, maxDistance) {
  // Find a node near the point.
  //
  // Parameters:
  //   point
  //     a tapspace.geometry.Point
  //   maxDistance
  //     a tapspace.geometry.Distance
  //
  // Return
  //   a nodeKey or null
  //

  // Normalize point onto stratum
  point = point.changeBasis(this.space)
  maxDistance = maxDistance.transitRaw(this.space)

  const nodes = Object.values(this.renderedNodes)

  const nearest = nodes.reduce((acc, node) => {
    const dist = node.getOrigin().getDistanceTo(point).getRaw()
    if (dist < acc.minDistance) {
      return {
        minDistance: dist,
        node: node
      }
    }
    return acc
  }, {
    minDistance: Infinity,
    node: null
  })

  if (!nearest.node) {
    return null
  }

  // Allow only nodes that are close enough.
  if (nearest.minDistance <= maxDistance) {
    return nearest.node.component.nodeKey
  }

  return null
}
