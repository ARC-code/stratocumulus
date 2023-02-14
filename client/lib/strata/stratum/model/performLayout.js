const graphologyLayout = require('graphology-layout')
// const graphologyForce = require('graphology-layout-force')
// const graphologyNoverlap = require('graphology-layout-noverlap')
// const optimizeRotation = require('./optimizeRotation')
const orientByNode = require('./orientByNode')
const translateByNode = require('./translateByNode')

module.exports = function (stratum, final = false) {
  // Apply layout to a graph.
  //
  // Parameters
  //   stratum
  //     a stratum object. The graph property will be modified.
  //

  graphologyLayout.circlepack.assign(stratum.graph, {
    hierarchyAttributes: ['parent'],
    center: 0,
    scale: 1.1
  })

  // Find root node for graph orientation.
  // Pick the root based on the context, the user arrival direction.
  const context = stratum.context
  const rootNode = stratum.graph.findNode((nodeKey, attrs) => {
    // Find the node that matches the context
    if (!attrs.facetParam || !attrs.facetValue || !context) {
      return false
    }
    if (context[attrs.facetParam] === attrs.facetValue) {
      return true
    }
    return false
  })

  // Consider possibility of the empty graph or no matching node
  if (rootNode) {
    // Keep the root at the left.
    orientByNode(stratum.graph, rootNode, Math.PI)
    // Translate so that the root at 0,0
    translateByNode(stratum.graph, rootNode, { x: 0, y: 0 })
  }
}
