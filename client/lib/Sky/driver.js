const findCurrentStratum = require('./findCurrentStratum')

module.exports = (sky, loader) => {
  // Driver for TreeLoader.
  // Driver is a handler ran at each viewport idle event.
  // Driver is responsible of triggering semantic zooming effects.
  // Driver initiates the loading of sub- and superstrata.
  //
  // Parameters:
  //   sky
  //   loader
  //

  // Detect when current stratum changes.
  let previousStratumPath = null

  sky.viewport.on('idle', () => {
    // DEBUG
    // console.log('sky.strata:', Object.keys(sky.strata).join(', '))
    // console.log('loader.spaces:', Object.keys(loader.spaces).join(', '))

    // Remove all too small spaces immediately.
    // Do this to avoid singular inversions.
    const singulars = sky.viewport.findSingular()
    singulars.forEach(space => {
      const spaceId = space.stratum.path
      space.stratum.remove()
      delete sky.strata[spaceId]
      loader.removeSpace(spaceId)
    })

    // Find closest stratum, our current location.
    const currentStratum = findCurrentStratum(sky)
    if (currentStratum) {
      const currentStratumPath = currentStratum.path
      console.log('currently nearest stratum:', currentStratumPath)

      // Classify the stratum space as current. Clear others.
      loader.getSpaces().forEach(space => {
        space.removeClass('current-stratum')
      })
      currentStratum.getSpace().addClass('current-stratum')

      // Prune the spaces, i.e. strata.
      // Close all sub and superstrata a couple of steps away.
      loader.closeNeighbors(currentStratumPath, 1)

      // Expand the parent. If not yet at root and if parent not yet open.
      if (currentStratumPath !== '/') {
        const eventData = { context: currentStratum.getSupercontext() }
        loader.openParent(currentStratumPath, eventData)
      }

      // Trigger possible substratum requests on the current stratum
      currentStratum.triggerSubstratum(sky.viewport)

      // Detect change of current stratum.
      if (previousStratumPath !== currentStratumPath) {
        previousStratumPath = currentStratumPath
        sky.emit('navigation', {
          previousPath: previousStratumPath,
          currentPath: currentStratumPath,
          context: currentStratum.context.copy()
        })
      }
    }

    // Reveal and hide node labels at each idle.
    Object.values(loader.spaces).forEach((space) => {
      if (space.stratum && space.stratum.revealLabels) {
        space.stratum.revealLabels()
      }
    })

    // Prevent viewport from getting too far from content.
    // const spaces = sky.viewport.getSpaces()
    // sky.viewport.limitTo(spaces, { maxAreaRatio: 10 })
  })
}
