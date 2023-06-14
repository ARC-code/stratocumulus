const Stratum = require('../../Stratum')

module.exports = (sky, loader) => {
  // Driver for TreeLoader. Driver is an idle handler.
  //
  // Parameters:
  //   sky
  //   loader
  //

  // Generator
  loader.on('open', (ev) => {
    // TODO use passed context object
    console.log('space open', ev)
    const stratumPath = ev.id

    const superStratumPath = ev.parentId || null
    const context = ev.data
    // const context = {}
    const label = 'todo'

    if (sky.strata[stratumPath]) {
      console.warn('Attempted to recreate existing stratum: ' + stratumPath)
      return
    }

    const stratum = new Stratum(stratumPath, superStratumPath, context, label)

    // Make Sky inform other processes that it is now non-empty.
    // Useful to make viewport interactive.
    if (loader.countSpaces() === 0) {
      // Wait to ensure stratum is in space.
      setTimeout(() => {
        stratum.once('first', () => {
          sky.emit('first')
        })
      }, 0)
    }

    // Add stratum to space via the loader.
    loader.addSpace(stratumPath, stratum.getSpace())
    if (loader.spaces[stratumPath]) {
      sky.strata[stratumPath] = stratum
    } else {
      console.warn('Could not add space', stratumPath)
      return
    }

    // Begin loading and rendering
    stratum.load()

    // Ensure superstratum node looks opened.
    if (ev.parentId) {
      const superStratum = sky.strata[ev.parentId]
      if (superStratum) {
        const superNode = superStratum.getNode(ev.id)
        if (superNode) {
          superNode.open()
        }
      }
    }
    // If the parent is opened, then ensure that it has the child open.
    if (ev.childId) {
      const superNode = stratum.getNode(ev.childId)
      if (superNode) {
        superNode.open()
      }
    }

    stratum.on('stratumrequest', (ev) => {
      // This event tells us that an interaction within the stratum
      // requested a substratum to be built and rendered.
      const parentPath = stratumPath
      const childPath = ev.path

      // Pass to next open
      const subcontext = sky.getSubcontext(parentPath, childPath)

      // HACK TODO allow opening child without setting demand.
      loader.demand[parentPath] = 2
      loader.openChild(parentPath, childPath, subcontext)
    })

    // TODO MAYBE
    // stratum.once('final', () => {
    //   // Position the stratum so that the node matches substratum.
    // })

    // TODO MAYBE
    // stratum.on('layoutchange', (ev) => {
    //   // Reposition also the substrata
    //   const parentPath = path
    //   loader.remapChildren(parentPath)
    // })
  })

  loader.on('replace', (ev) => {
    console.log('space replaced', ev)
  })

  loader.on('close', (ev) => {
    console.log('space closing', ev)

    // Close the containing node
    const superPath = ev.space.stratum.superpath
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
