module.exports = (space, graph) => {
  // Remove all graph node and edge elements that do not anymore exist in
  // the given graph.
  //
  // Parameters:
  //   space
  //     a tapspace Space
  //   graph
  //     a graphology Graph
  //

  const nodeItems = space.nodeGroup.getChildren() // HACKY

  nodeItems.forEach(nodeItem => {
    const nodeKey = nodeItem.model.nodeKey

    if (!graph.hasNode(nodeKey)) {
      nodeItem.remove()
    }
  })

  const edgeItems = space.edgeGroup.getChildren() // HACKY

  edgeItems.forEach(edgeItem => {
    const edgeKey = edgeItem.model.edgeKey

    if (!graph.hasEdge(edgeKey)) {
      edgeItem.remove()
    }
  })
}
