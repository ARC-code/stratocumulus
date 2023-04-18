const graphologyLayout = require('graphology-layout')
// const graphologyForce = require('graphology-layout-force')
// const graphologyNoverlap = require('graphology-layout-noverlap')
// const optimizeRotation = require('./optimizeRotation')
const orientByNode = require('./orientByNode')
const translateByNode = require('./translateByNode')
const findNodeByContext = require('../../model/findNodeByContext')

module.exports = function (stratum, final = false) {
  // Compute layout for a graph without modifying it.
  //
  // Parameters
  //   stratum
  //     a stratum object. The graph property will be modified.
  //   final
  //     a boolean. Set true for additional finish. TODO is it needed?
  //
  // Return
  //   a map: path -> {x,y}. The graphology layout positions.
  //

  let positions = graphologyLayout.circlepack(stratum.graph, {
    hierarchyAttributes: ['parent'],
    center: 0,
    scale: 1.1
  })

  // Find root node for graph orientation.
  // Pick the root based on the context, the user arrival direction.
  const rootNode = findNodeByContext(stratum.graph, stratum.context)

  // Consider possibility of the empty graph or no matching node.
  if (rootNode) {
    // Keep the root at the left.
    positions = orientByNode(positions, rootNode, Math.PI)
    // Translate so that the root at 0,0
    positions = translateByNode(positions, rootNode, { x: 0, y: 0 })
  }

  return positions
}