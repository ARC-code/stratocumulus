const findCurrentStratum = require('./findCurrentStratum')

module.exports = (sky, loader) => {
  // Driver for TreeLoader. Driver is an idle handler.
  //
  // Parameters:
  //   sky
  //   loader
  //
  sky.viewport.on('idle', () => {
    console.log('sky.strata:', Object.keys(sky.strata).join(', '))
    console.log('loader.spaces:', Object.keys(loader.spaces).join(', '))
    // Remove all too small spaces immediately.
    // Do this to avoid singular inversions.
    const singulars = sky.viewport.findSingular()
    singulars.forEach(space => {
      const spaceId = space.stratum.path
      loader.removeSpace(spaceId)
    })

    // Find closest stratum, our current location.
    const currentStratum = findCurrentStratum(sky)
    if (!currentStratum) {
      console.warn('No current stratum found.')
      return
    }
    const currentStratumPath = currentStratum.path
    console.log('currently nearest stratum:', currentStratumPath)

    // Prune the spaces, i.e. strata.
    // Close all sub and superstrata a couple of steps away.
    loader.closeNeighbors(currentStratumPath, 1)
    // Expand the parent. If not yet open.
    // TODO refactor TreeLoader so that demand is not needed.
    loader.demand[currentStratumPath] = 2
    loader.openParent(currentStratumPath)

    // On the current stratum, find a few nearest openable nodes.
    const stratumNodes = currentStratum.getNodes()
    const nodeItems = stratumNodes.map(node => node.component)
    const nearestItemMetrics = sky.viewport.measureNearest(nodeItems, 2)
    const reachableItemMetrics = nearestItemMetrics.filter(metric => {
      return metric.areaRatio > 0.1
    })
    const reachableItems = reachableItemMetrics.map(metric => metric.target)
    const reachableNodeKeys = reachableItems.map(item => item.nodeKey)
    const reachableNodes = reachableNodeKeys.map(key => currentStratum.getNode(key))
    const reachableFacetableNodes = reachableNodes.filter(n => n.isFacetable())
    const reachableFacetableNodeKeys = reachableFacetableNodes.map(n => n.key)

    // Open the nearest nodes
    // console.log('reachable nodes: ', reachableNodeKeys.join(','))
    // console.log('reachable facetable nodes: ', reachableFacetableNodeKeys.join(','))
    reachableFacetableNodeKeys.forEach((nodeKey) => {
      const parentPath = currentStratumPath
      const subcontext = sky.getSubcontext(parentPath, nodeKey)
      loader.openChild(currentStratumPath, nodeKey, subcontext)
    })

    // Prevent viewport from getting too far from content.
    // if (currentSpace) {
    //   const spaces = sky.viewport.getSpaces()
    //   sky.viewport.limitTo(spaces)
    // }
  })
}
