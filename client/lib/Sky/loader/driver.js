const findCurrentStratum = require('./findCurrentStratum')
const findCurrentNode = require('./findCurrentNode')

module.exports = (sky, loader) => {
  // Driver for TreeLoader. Driver is an idle handler.
  //
  // Parameters:
  //   sky
  //   loader
  //
  sky.viewport.on('idle', () => {
    // console.log('sky.strata:', Object.keys(sky.strata).join(', '))
    console.log('loader.spaces:', Object.keys(loader.spaces).join(', '))

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
    if (!currentStratum) {
      console.log('currently nearest stratum: -')
      return
    }
    const currentStratumPath = currentStratum.path
    console.log('currently nearest stratum:', currentStratumPath)

    // Prune the spaces, i.e. strata.
    // Close all sub and superstrata a couple of steps away.
    loader.closeNeighbors(currentStratumPath, 1)

    // Expand the parent. If not yet at root and if parent not yet open.
    const superpath = currentStratum.getSuperpath()
    if (superpath) {
      const eventData = {
        path: superpath,
        trail: currentStratum.getSupertrail(),
        context: currentStratum.getSupercontext()
      }
      loader.openParent(currentStratumPath, eventData)
    }

    // On the current stratum, find the nearest openable node.
    const currentNode = findCurrentNode(sky, currentStratum)
    // If current node available, open it.
    if (currentNode) {
      const subpath = currentNode.key
      const eventData = {
        path: subpath,
        trail: currentStratum.getSubtrail(),
        context: currentStratum.getSubcontext(subpath)
      }
      loader.openChild(currentStratumPath, subpath, eventData)
    }

    // TODO Prevent viewport from getting too far from content.
    // if (currentSpace) {
    //   const spaces = sky.viewport.getSpaces()
    //   sky.viewport.limitTo(spaces)
    // }
  })
}
