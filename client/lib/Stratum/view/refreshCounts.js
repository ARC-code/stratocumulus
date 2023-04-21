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
    const nodeAttrs = graph.getNodeAttributes(nodeKey)

    const nodeSize = nodeAttrs.size
    const newSize = { w: nodeSize, h: nodeSize }
    nodeItem.resizeTo(newSize, nodeItem.atCenter())

    // Find the color node and label
    const nodeItemElem = nodeItem.getElement()
    const nodeElement = nodeItemElem.querySelector('.node')
    const countElement = nodeItemElem.querySelector('.node-label-count')

    // Number of documents define the node color.
    // Stale nodes are treated as empty.
    const nodeIsStale = nodeAttrs.stale
    const nodeValue = nodeAttrs.value
    if (nodeValue < 0.1 || nodeIsStale) {
      nodeElement.classList.add('empty-node')
    } else {
      nodeElement.classList.remove('empty-node')
    }

    // Update the label count. Some nodes do not have counts.
    // Stale nodes have unknown count.
    if (countElement) {
      if (nodeIsStale) {
        // Still waiting for valid count
        countElement.innerText = '***'
      } else {
        // Add thousands separator for readability
        countElement.innerText = nodeValue.toLocaleString('en-US')
      }
    }
  })
}
