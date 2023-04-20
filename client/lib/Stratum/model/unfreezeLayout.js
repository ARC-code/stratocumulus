module.exports = (graph) => {
  // Release all nodes by marking them as NOT 'fixed'.
  // Use this to enable layouting after finished filter loading for example.
  //
  // Parameters:
  //   a graphology Graph
  //

  graph.updateEachNodeAttributes((nodeKey, nodeAttrs) => {
    return {
      ...nodeAttrs,
      fixed: false
    }
  })
}
