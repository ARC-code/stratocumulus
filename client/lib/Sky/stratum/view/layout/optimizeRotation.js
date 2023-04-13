const graphologyLayout = require('graphology-layout')

module.exports = function (graph) {
  // Optimize graph layout rotation so that most nodes are visible.
  const rotations = {}
  let rotationDegree = 0
  let zeroOutliersFound = false

  while (rotationDegree <= 340) {
    const nodeCoords = graph.mapNodes((nodeId, nodeAttrs) => {
      const x = nodeAttrs.x + (window.innerWidth / 2)
      const y = nodeAttrs.y + (window.innerHeight / 2)
      return [x, y]
    })

    // Find if some nodes are outside viewport
    let outliers = 0
    const w = window.innerWidth
    const h = window.innerHeight
    for (const coord of nodeCoords) {
      if (coord[0] < 0 || coord[0] > w || coord[1] < 0 || coord[1] > h) {
        outliers += 1
      }
    }
    rotations[outliers] = rotationDegree

    if (rotationDegree > 0 || rotationDegree < 340) {
      const opts = { degrees: true, centeredOnZero: true }
      graphologyLayout.rotation.assign(graph, rotationDegree, opts)
    }

    if (outliers === 0) {
      zeroOutliersFound = true
      break
    } else {
      rotationDegree += 20
    }
  }

  // If outliers were found, apply the rotation with least outliers
  if (!zeroOutliersFound) {
    const fewestOutliers = Math.min(...Object.keys(rotations))
    const bestRotation = rotations[fewestOutliers]
    const degreesToRotate = bestRotation + (360 - rotationDegree)

    const opts = { degrees: true }
    graphologyLayout.rotation.assign(graph, degreesToRotate, opts)
  }
}
