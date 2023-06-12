module.exports = (sky, loader) => {
  // Driver for TreeLoader. Driver is an idle handler.
  //
  // Parameters:
  //   sky
  //   loader
  //

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
}
