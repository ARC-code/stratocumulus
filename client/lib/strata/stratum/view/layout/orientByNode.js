const rotatePositions = require('./rotatePositions')

module.exports = (nodePositions, nodeKey, angle) => {
  // Rotate the positions so that the specified node
  // is located at the given angle relative to the positions mean.
  // Does not modify the given positions.
  //
  // Parameters:
  //   nodePositions
  //     a map: path -> {x,y}
  //   nodeKey
  //     a string
  //   angle
  //     a number in radians
  //
  // Return
  //   a map: path -> {x,y}. The oriented node positions.
  //

  const nodePosition = nodePositions[nodeKey]
  // Ensure node exists
  if (!nodePosition) {
    // No such node, already oriented
    console.log('no such node')
    return
  }

  // Align by these coordinates
  const gravity = {
    x: nodePosition.x,
    y: nodePosition.y
  }

  // Compute sum for mean point
  const nodeKeys = Object.keys(nodePositions)
  const meanSum = nodeKeys.reduce((accumulator, key) => {
    const xy = nodePositions[key]
    return {
      xsum: accumulator.xsum + xy.x,
      ysum: accumulator.ysum + xy.y
    }
  }, { xsum: 0, ysum: 0 })
  // Compute mean; handle empty graph
  const numNodes = nodeKeys.length
  const meanPoint = {
    x: meanSum.xsum / Math.max(1, numNodes),
    y: meanSum.ysum / Math.max(1, numNodes)
  }

  // Find angle from the mean to the gravity.
  const dx = gravity.x - meanPoint.x
  const dy = gravity.y - meanPoint.y
  // Vector angle. This amount of rotation would rotate the gravity to zero.
  const gravityAngle = Math.atan2(dy, dx)

  // Target angle. This amount of rotation would rotate gravity
  // to the desired angle.
  const targetAngle = angle - gravityAngle

  // Rotate the positions
  const newPositions = rotatePositions(nodePositions, meanPoint, targetAngle)

  return newPositions
}
