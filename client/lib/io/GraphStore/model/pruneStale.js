module.exports = (graph) => {
  // Remove all stale nodes and edges. Modifies the given graph.
  //
  // Parameters:
  //   a graphology Graph
  //

  const staleNodes = graph.filterNodes((nodeKey, nodeAttrs) => {
    return nodeAttrs.stale
  })

  staleNodes.forEach(nodeKey => {
    // Removes the node and all its edges.
    graph.dropNode(nodeKey)
  })
}
