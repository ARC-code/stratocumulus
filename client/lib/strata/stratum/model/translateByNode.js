module.exports = (graph, nodeKey, targetPoint) => {
  // Translate graph so that the selected node moves to the given point.
  //
  // Parameters:
  //   graph
  //   nodeKey
  //   targetPoint
  //

  const node = graph.getNodeAttributes(nodeKey)
  // Ensure node exists
  if (!node) {
    console.log('no such node')
    return
  }

  const nodePoint = {
    x: node.x,
    y: node.y
  }

  // Find translation from the node to the target.
  const dx = targetPoint.x - nodePoint.x
  const dy = targetPoint.y - nodePoint.y

  graph.updateEachNodeAttributes((nodeKey, attr) => {
    attr.x += dx
    attr.y += dy
    return attr
  }, {
    attributes: ['x', 'y']
  })

  // DEBUG
  // console.log('translated by', dx, dy)
}
