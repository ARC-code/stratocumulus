const computeNodeSize = require('./node/nodeSize')

module.exports = function (space, graph) {
  // Refresh the counts and sizes of all nodes.
  //
  // Parameters:
  //   space
  //     a tapspace space, the container of the nodes.
  //   graph
  //     a graphology graph, to get the size for the nodes.
  //
  const nodeItems = space.nodeGroup.getChildren() // HACKY

  nodeItems.forEach((nodeItem) => {
    const nodeKey = nodeItem.model.nodeKey
    const nodeSize = graph.getNodeAttribute(nodeKey, 'size')

    const newSize = { w: nodeSize, h: nodeSize }
    nodeItem.resizeTo(newSize, nodeItem.atCenter())
  })
}
