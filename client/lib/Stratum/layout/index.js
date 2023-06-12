const graphologyLayout = require('graphology-layout')
// const graphologyForce = require('graphology-layout-force')
// const graphologyNoverlap = require('graphology-layout-noverlap')
// const forceAtlas2 = require('graphology-layout-forceatlas2')
// const optimizeRotation = require('./optimizeRotation')
// const orientByNode = require('./orientByNode')
// const translateByNode = require('./translateByNode')
// const findNodeByContext = require('../model/findNodeByContext')
// const treepack = require('./treepack')
const normalizeSizes = require('./normalizeSizes')
// const tapspace = require('tapspace')

module.exports = function (graph, context) {
  // Compute layout for a graph without modifying it.
  //
  // Parameters
  //   graph
  //     a graphology Graph.
  //   context
  //     a stratum context object.
  //
  // Return
  //   a map: nodeKey -> {x,y}. The graphology layout positions.
  //

  // Normalize node sizes before layout
  normalizeSizes(graph)

  // graphologyLayout.circlepack.assign(graph, {
  const positions = graphologyLayout.circlepack(graph, {
    hierarchyAttributes: ['parent'],
    center: 0,
    scale: 1.1
  })

  // const positions = treepack(graph)

  // const positions = forceAtlas2(graph, {
  //   iterations: 100,
  //   settings: {
  //     adjustSizes: true,
  //     // scalingRatio: 4,
  //     gravity: 1
  //   }
  // })
  // const positions = graphologyForce(graph, {
  //   maxIterations: 500,
  //   settings: {
  //     attraction: 0.0005,
  //     repulsion: 0.2,
  //     gravity: 0.0001
  //   }
  // })

  // The following commented lines would orient the graph
  // so that the faceting node is at the left.
  // It looks funny but is likely disorienting because things
  // are not anymore on the same places.

  // // Find root node for graph orientation.
  // // Pick the root based on the context, the user arrival direction.
  // const rootNode = findNodeByContext(graph, context)
  //
  // // Consider possibility of the empty graph or no matching node.
  // if (rootNode) {
  //   // Keep the root at the left.
  //   positions = orientByNode(positions, rootNode, Math.PI)
  //   // Translate so that the root at 0,0
  //   positions = translateByNode(positions, rootNode, { x: 0, y: 0 })
  // }

  return positions
}
