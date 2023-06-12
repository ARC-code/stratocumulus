module.exports = (sky, loader) => {
  // Driver for TreeLoader. Driver is an idle handler.
  //
  // Parameters:
  //   sky
  //   loader
  //
  sky.viewport.on('idle', () => {
    const spaces = sky.viewport.getSpaces()

    // Remove all too small spaces immediately.
    // Do this to avoid singular inversions.
    const singulars = sky.viewport.findSingular()
    singulars.forEach(space => {
      const spaceId = space.stratumPath
      loader.removeSpace(spaceId)
    })

    // DEBUG
    // const numNodes = spaces.length - singulars.length
    // const metersEl = document.getElementById('meters')
    // metersEl.innerHTML = '# of nodes: ' + numNodes

    // Find closest, our current location.
    const nearestMetrics = sky.viewport.measureNearest(spaces, 1)
    const nearestSpaces = nearestMetrics.map(ne => ne.target)

    // Prune the tree.
    const nearestIds = nearestSpaces.map(space => space.stratumPath)
    loader.closeNeighbors(nearestIds, 2)

    // TODO refactor TreeLoader so that demand is not needed.
    loader.demand[nearestIds[0]] = 2
    loader.openParent(nearestIds[0])

    console.log('currently nearest stratum:', nearestIds[0])

    // Prevent viewport from getting too far from the current nodes.
    sky.viewport.limitTo(nearestSpaces)
  })
}
