module.exports = (graph) => {
  // Invalidate all nodes and edges of the graph.
  // Use this to distinguish subgraph that can be removed
  // after filtering is finished.
  //
  // Parameters:
  //   a graphology Graph
  //

  graph.updateEachNodeAttributes((nodeKey, nodeAttrs) => {
    return {
      ...nodeAttrs,
      stale: true
    }
  })

  graph.updateEachEdgeAttributes((edgeKey, edgeAttrs) => {
    return {
      ...edgeAttrs,
      stale: true
    }
  })
}
