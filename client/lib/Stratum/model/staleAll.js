module.exports = (graph) => {
  // Mark all nodes as stale.
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

  // NOTE: No need to stale edges because when we remove a stale node
  // NOTE: by calling graph.dropNode, it will remove also the node edges.
  // graph.updateEachEdgeAttributes((edgeKey, edgeAttrs) => {
  //   return {
  //     ...edgeAttrs,
  //     stale: true
  //   }
  // })
}
