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
      const currentSpace = currentStratum.getSpace()
      currentSpace.addClass('current-stratum')
      loader.getSpaces().forEach(space => {
        if (space !== currentSpace) {
          space.removeClass('current-stratum')
        }
      })

      // Prune the spaces, i.e. strata.
      // Close all sub and superstrata a couple of steps away.
      loader.closeNeighbors(currentStratumPath, 1)

      // Expand the parent. If not yet at root and if parent not yet open.
      if (currentStratumPath !== '/') {
        const eventData = { context: currentStratum.getSupercontext() }
        loader.openParent(currentStratumPath, eventData)
      }

      // Trigger possible viewport-dependent substratum requests
      // on the current stratum.
      currentStratum.triggerSubstratum(sky.viewport)

      // Detect change of current stratum.
      if (this.currentStratumPath !== currentStratumPath) {
        const previous = this.currentStratumPath
        this.currentStratumPath = currentStratumPath
        sky.emit('navigation', {
          previousPath: previous,
          currentPath: currentStratumPath,
          context: currentStratum.context.copy()
        })
      }
    } else {
      // No current stratum; no stratum pinned inside viewport.
      // The nearest stratum might be very small if users zoomed out quickly.
      // Therefore, if there is a previous stratum, expand its parent.
      // TODO improve to find the largest visible stratum and use it
      // TODO as the current stratum.
      if (this.currentStratumPath && this.currentStratumPath !== '/') {
        const lastKnownPath = this.currentStratumPath
        const lastKnownStratum = sky.strata[lastKnownPath]
        if (lastKnownStratum) {
          const eventData = { context: lastKnownStratum.getSupercontext() }
          loader.openParent(lastKnownPath, eventData)
        }
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
