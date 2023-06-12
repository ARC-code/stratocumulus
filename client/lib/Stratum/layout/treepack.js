const tapspace = require('tapspace')

// const findRoot = (graph, nodeKey, parentAttr) => {
//   // Find root node key.
//   //
//   // Parameters:
//   //   graph
//   //     a graphology Graph
//   //   nodeKey
//   //     a string, the starting node
//   //   parentAttr
//   //     a string, the name of the attribute, that stores the parent node key.
//   //
//   // Return
//   //   a string
//   //
//   let key = nodeKey
//   while (key) {
//     const attrs = graph.getNodeAttributes(key)
//     if (!attrs) {
//       throw new Error('Node does not exist')
//     }
//     key = attrs[parentAttr]
//   }
//   return nodeKey
// }
//
// const findParent = (graph, nodeKey, parentAttr) => {
//   // Find parent node key.
//   //
//   // Parameters:
//   //   graph
//   //     a graphology Graph
//   //   nodeKey
//   //     a string, the child node key.
//   //   parentAttr
//   //     a string, the name of the attribute, that stores the parent node key.
//   //
//   // Return
//   //   a string, or null if no parent.
//   //
//   const attrs = graph.getNodeAttributes(nodeKey)
//   const parent = attrs[parentAttr]
//   if (parent) {
//     return parent
//   }
//   return null
// }
//
// const findChildren = (graph, nodeKey, parentAttr) => {
//   // Find child nodes.
//   //
//   // Parameters:
//   //   graph
//   //     a graphology Graph
//   //   nodeKey
//   //     a string, the parent node key.
//   //   parentAttr
//   //     a string, the name of the attribute, that stores the parent node key.
//   //
//   // Return
//   //   array of key
//   //
//   return graph.filterNodes((key, attrs) => {
//     return attrs[parentAttr] === nodeKey
//   })
// }

module.exports = (graph) => {
  // Compute layout for the graph.
  //
  // Return
  //   object, key -> point
  //

  const positions = {}

  const nodeToPoint = (nodeKey, attributes) => {
    if (nodeKey === '/') {
      return { x: 0, y: 0 }
    }
    const pathParts = nodeKey.split('/').filter(part => part.length > 0)
    // Single parts are root-like?
    if (pathParts.length === 0) {
      // Root
      return { x: 0, y: 0 }
    }
    if (pathParts.length === 1) {
      // Root
      return { x: 0, y: 0 }
    }
    if (pathParts.length === 2) {
      // A grouping node
      const dir = 2 * Math.PI * Math.random()
      const parentSize = graph.getNodeAttributes('/arc').size
      const dist = parentSize * 3
      return tapspace.math.point2.polarOffset({ x: 0, y: 0 }, dist, dir)
    }

    if (pathParts.length === 3) {
      // A facet node
      console.log('attributes', attributes)
      const parentPath = attributes.parent
      if (parentPath === nodeKey) {
        throw new Error('Weird recursion, parent is self.')
      }
      const parentPoint = positions[parentPath]
      const parentSize = graph.getNodeAttributes(parentPath).size
      const dist = parentSize * 2
      const dir = 2 * Math.PI * Math.random()
      return tapspace.math.point2.polarOffset(parentPoint, dist, dir)
    }

    // Default
    return { x: Math.random(), y: Math.random() }
  }

  // Compute points beginning from the root, so that parent always has a point.
  // Sort according to num of path parts.
  const pathLengthTiers = {}
  graph.forEachNode((nodeKey, attributes) => {
    const pathParts = nodeKey.split('/').filter(part => part.length > 0)
    const len = pathParts.length
    if (pathLengthTiers[len]) {
      pathLengthTiers[len][nodeKey] = attributes
    } else {
      const obj = {}
      obj[nodeKey] = attributes
      pathLengthTiers[len] = obj
    }
  })

  Object.keys(pathLengthTiers).forEach((tier) => {
    const nodes = pathLengthTiers[tier]
    Object.keys(nodes).forEach((nodeKey) => {
      const nodeAttrs = nodes[nodeKey]
      positions[nodeKey] = nodeToPoint(nodeKey, nodeAttrs)
    })
  })

  console.log(positions)

  return positions
}
