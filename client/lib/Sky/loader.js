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
        const childNode = parentStratum.getNode(childId)
        const childBasis = childNode.component.getBasis()
        return childBasis.scaleBy(0.1, childNode.getOrigin())
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
      label: 'ARC',
      bgColor: '#444444',
      context: {}
    }
  }

  // Generator
  loader.on('open', (stratumPath) => {
    // TODO use passed context object

    let context, label, bgColor
    if (contextCache[stratumPath]) {
      const cached = contextCache[stratumPath]
      context = cached.context
      label = cached.label
      bgColor = cached.bgColor
      // Consume
      delete contextCache[stratumPath]
    } else {
      // DEBUG
      throw new Error('Missing stratum context')
    }

    const stratum = sky.createStratum(stratumPath, context, label, bgColor)
    // Begin loading and rendering
    stratum.load()

    stratum.on('stratumrequest', (ev) => {
      // This event tells us that an interaction within the stratum
      // requested a substratum to be built and rendered.
      const parentPath = stratumPath
      const childPath = ev.path

      // Pass to next open
      contextCache[childPath] = {
        path: childPath,
        label: ev.label,
        bgColor: ev.bgColor,
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

  // Driver for TreeLoader
  sky.viewport.on('idle', () => {
    // console.log('driver run')
  })

  return loader
}
