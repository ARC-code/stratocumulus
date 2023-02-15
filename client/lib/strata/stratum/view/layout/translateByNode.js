module.exports = (nodePositions, nodeKey, targetPoint) => {
  // Translate nodes so that the selected node moves to the given point.
  //
  // Parameters:
  //   nodePositions
  //     a map: path -> {x,y}
  //   nodeKey
  //     a string
  //   targetPoint
  //
  // Return
  //   a map: path -> {x,y}. The translated node positions.
  //

  const nodePosition = nodePositions[nodeKey]
  // Ensure node exists
  if (!nodePosition) {
    console.log('no such node')
    return
  }

  // Find translation from the node to the target.
  const dx = targetPoint.x - nodePosition.x
  const dy = targetPoint.y - nodePosition.y

  // Construct the translated positions to a new map.
  return Object.keys(nodePositions).reduce((accumulator, nodeKey) => {
    const np = nodePositions[nodeKey]
    // Apply rotation around origin
    accumulator[nodeKey] = {
      x: np.x + dx,
      y: np.y + dy
    }
    return accumulator
  }, {})
}
