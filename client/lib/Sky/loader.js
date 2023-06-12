const tapspace = require('tapspace')

module.exports = (sky) => {
  // Use tapspace TreeLoader for loading and unloading of fractal spaces.
  //

  const loader = new tapspace.loaders.TreeLoader({
    viewport: sky.viewport,

    mapper: function (parentId, parentSpace, childId) {
      // Position the child relative to the parent.
      // In other words, find a basis for the child.
      // If there is no position for the child, null.
      if (sky.strata[parentId]) {
        const parentStratum = sky.strata[parentId]
        const facetNode = parentStratum.getNode(childId)
        const childBasis = facetNode.component.getBasis()
        return childBasis.scaleBy(0.1, facetNode.getOrigin())
      }
      return null
    },

    tracker: function (parentId, parentSpace) {
      // Get IDs of the children of the parent component.
      if (sky.strata[parentId]) {
        return sky.getSubstratumPaths(parentId)
      }
      return []
    },

    backtracker: function (childId, childSpace) {
      // Find parent id.
      // If no parent and the child is the root node, return null.
      if (sky.strata[childId]) {
        return sky.getSuperstratumPath(childId)
      }
      return null
    }
  })

  // The TreeLoader does not handle context data,
  // thus we cache it for open events.
  const contextCache = {
    '/': {
      path: '/',
      superpath: null,
      label: 'ARC',
      context: {}
    }
  }

  // Generator
  loader.on('open', (stratumPath) => {
    // TODO use passed context object

    let context, label, parentPath
    if (contextCache[stratumPath]) {
      const cached = contextCache[stratumPath]
      context = cached.context
      label = cached.label
      parentPath = cached.superpath
      // Consume. TODO how to build context for parent?
      // delete contextCache[stratumPath]
    } else {
      // DEBUG
      throw new Error('Missing stratum context')
    }

    const stratum = sky.createStratum(stratumPath, parentPath, context, label)

    // Begin loading and rendering
    stratum.load()

    // TODO
    // stratum.once('final', () => {
    //   // Position the stratum so that the node matches substratum.
    // })

    stratum.on('stratumrequest', (ev) => {
      // This event tells us that an interaction within the stratum
      // requested a substratum to be built and rendered.
      const parentPath = stratumPath
      const childPath = ev.path

      // Pass to next open
      contextCache[childPath] = {
        path: childPath,
        superpath: parentPath,
        label: ev.label,
        context: sky.getSubcontext(parentPath, childPath)
      }

      // HACK TODO allow opening child without setting demand.
      loader.demand[parentPath] = 2
      loader.openChild(parentPath, childPath)
    })

    // TODO MAYBE
    // stratum.on('layoutchange', (ev) => {
    //   // Reposition also the substrata
    //   const parentPath = path
    //   loader.remapChildren(parentPath)
    // })

    // Make Sky inform other processes that it is now non-empty.
    // Useful to make viewport interactive.
    // TODO use loader.countSpaces()
    if (Object.keys(loader.spaces).length === 0) {
      stratum.once('first', () => {
        sky.emit('first')
      })
    }

    // Add stratum to space via the loader.
    loader.open(stratumPath, stratum.getSpace())
  })

  loader.on('close', (ev) => {
    console.log('space closed', ev)

    // Close the containing node
    const superPath = sky.getSuperstratumPath(ev.id)
    const superStratum = sky.strata[superPath]
    if (superStratum) {
      const superNode = superStratum.getNode(ev.id)
      if (superNode) {
        superNode.close()
      }
    }

    // Remove the contained stratum.
    const stratumPath = ev.id
    sky.removeStratum(stratumPath)
  })

  // Driver for TreeLoader
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

  return loader
}
