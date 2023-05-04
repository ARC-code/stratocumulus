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

  const renderedNodeKeys = Object.keys(this.renderedNodes)
  const renderedEdgeKeys = Object.keys(this.renderedEdges)

  renderedNodeKeys.forEach(nodeKey => {
    if (!graph.hasNode(nodeKey)) {
      const stratumNode = this.renderedNodes[nodeKey]
      stratumNode.remove()
    }
  })

  renderedEdgeKeys.forEach(edgeKey => {
    if (!graph.hasEdge(edgeKey)) {
      const edgeItem = this.renderedEdges[edgeKey]
      edgeItem.remove()
    }
  })
}
