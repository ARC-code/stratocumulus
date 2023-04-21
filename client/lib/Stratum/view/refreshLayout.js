const layoutGraph = require('./layout')
const generateNodeId = require('./node/generateNodeId')

module.exports = (space, graph, path, context) => {
  // Update the graph layout. If elements already exist, update.
  //
  // Parameters:
  //   space
  //     a tapspace Space
  //   graph
  //     a graphology Graph
  //   path
  //     a stratum path. Required to find node elements.
  //   context
  //     the filtering context object. Affects layout origin.
  //

  // Compute layout
  const layoutPositions = layoutGraph(graph, context)
  const stratumOrigin = space.at(0, 0)

  const nodeItems = space.nodeGroup.getChildren() // HACKY
  nodeItems.forEach((nodeItem) => {
    const nodeKey = nodeItem.model.nodeKey

    const nPosition = layoutPositions[nodeKey]
    if (!nPosition) {
      // DEBUG
      console.warn('Tried to layout non-existing node.')
      return
    }

    const nPoint = stratumOrigin.offset(nPosition.x, nPosition.y)

    nodeItem.translateTo(nPoint)
  })

  const edgeItems = space.edgeGroup.getChildren() // HACKY
  edgeItems.forEach(edgeItem => {
    const sourceNodeKey = edgeItem.model.sourceKey
    const targetNodeKey = edgeItem.model.targetKey

    const sourceId = generateNodeId(path, sourceNodeKey)
    const targetId = generateNodeId(path, targetNodeKey)

    // Move edge to position. We need the nodes.
    const sourceElem = document.getElementById(sourceId)
    const targetElem = document.getElementById(targetId)

    // Ensure both exists and are affine
    if (!sourceElem || !targetElem) {
      console.warn('Tried to layout an between non-existent elements.')
    }

    if (!sourceElem.affine || !targetElem.affine) {
      console.error('Tried to layout an edge between non-tapspace elements.')
    }

    // Edge endpoints are valid tapspace elements.
    edgeItem.setPoints(
      sourceElem.affine.atAnchor(),
      targetElem.affine.atAnchor()
    )
  })
}
