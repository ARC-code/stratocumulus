const graphologyLayout = require('graphology-layout')
// const graphologyForce = require('graphology-layout-force')
// const graphologyNoverlap = require('graphology-layout-noverlap')
// const forceAtlas2 = require('graphology-layout-forceatlas2')
// const treepack = require('./treepack')
const normalizeSizes = require('./normalizeSizes')
const rotatePositions = require('./rotatePositions')

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
  let positions = graphologyLayout.circlepack(graph, {
    hierarchyAttributes: ['parent'],
    center: 0,
    scale: 1.1
  })

  positions = rotatePositions(positions, { x: 0, y: 0 }, -Math.PI / 2)

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

  return positions
}
