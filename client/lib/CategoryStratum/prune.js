module.exports = function () {
  // @CategoryStratum:prune()
  //
  // Remove all graph node and edge elements that do not anymore exist in
  // the given graph.
  //

  const renderedNodeKeys = Object.keys(this.renderedNodes)
  const renderedEdgeKeys = Object.keys(this.renderedEdges)

  renderedNodeKeys.forEach(nodeKey => {
    if (!this.graph.hasNode(nodeKey)) {
      const catNode = this.renderedNodes[nodeKey]
      catNode.remove()
      delete this.renderedNodes[nodeKey]
    }
  })

  renderedEdgeKeys.forEach(edgeKey => {
    if (!this.graph.hasEdge(edgeKey)) {
      const edgeItem = this.renderedEdges[edgeKey]
      edgeItem.remove()
      delete this.renderedEdges[edgeKey]
    }
  })
}
