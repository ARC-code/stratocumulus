const graphologyLayout = require('graphology-layout')
const rotation = graphologyLayout.rotation

module.exports = (graph, nodeKey, angle) => {
  //
  // Parameters:
  //   graph
  //   nodeKey
  //   angle
  //

  const node = graph.getNodeAttributes(nodeKey)
  // Ensure node exists
  if (!node) {
    // No such node, already oriented
    console.log('no such node')
    return
  }

  // Align these coordinates
  const gravity = {
    x: node.x,
    y: node.y
  }

  // Compute sum for mean point
  const meanSum = graph.reduceNodes((accumulator, nodeKey, nodeAttributes) => {
    return {
      xsum: accumulator.xsum + nodeAttributes.x,
      ysum: accumulator.ysum + nodeAttributes.y
    }
  }, { xsum: 0, ysum: 0 })
  // Compute mean; handle empty graph
  const meanPoint = {
    x: meanSum.xsum / Math.max(1, graph.order),
    y: meanSum.ysum / Math.max(1, graph.order)
  }

  // Find angle from the mean to the gravity.
  const dx = gravity.x - meanPoint.x
  const dy = gravity.y - meanPoint.y
  // Vector angle. This amount of rotation would rotate the gravity to zero.
  const gravityAngle = Math.atan2(dy, dx)

  // Target angle. This amount of rotation would rotate gravity
  // to the desired angle.
  const targetAngle = angle - gravityAngle

  // Rotate the graph
  rotation.assign(graph, targetAngle)
}
