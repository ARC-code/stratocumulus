module.exports = (graph) => {
  // Fix all nodes at their current places by marking them as 'fixed'.
  // Use this to prevent layout calls change the positions during filtering.
  //
  // Parameters:
  //   a graphology Graph
  //

  graph.updateEachNodeAttributes((nodeKey, nodeAttrs) => {
    return {
      ...nodeAttrs,
      fixed: true
    }
  })
}
