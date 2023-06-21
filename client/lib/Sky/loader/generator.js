const Stratum = require('../../Stratum')
const contextToSuperpath = require('./contextToSuperpath')

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
    const context = ev.data // filtering context for this stratum
    const label = 'todo'

    // DEBUG
    if (sky.strata[stratumPath]) {
      console.warn('Attempted to recreate existing stratum: ' + stratumPath)
      return
    }

    // Find superstratum path because stratum creation needs it.
    let superstratumPath
    if (ev.parentId) {
      // Simple case: a superstratum opened this stratum.
      superstratumPath = ev.parentId
    } else if (ev.childId) {
      // Complex case: a substratum opened this stratum.
      // Substratum knows only its superstratum (= this stratum), no further.
      // Use the context to determine the superstratum for this stratum.
      superstratumPath = contextToSuperpath(context)
    } else {
      // Root stratum
      superstratumPath = null
    }

    // Create
    const stratum = new Stratum(stratumPath, superstratumPath, context, label)
    sky.strata[stratumPath] = stratum

    // Add stratum to space via the loader.
    const spaceAdded = loader.addSpace(stratumPath, stratum.getSpace())
    if (!spaceAdded) {
      // Likely no mapping found yet in case of a superstratum.
      // Postpone addition to final event.
      console.warn('Could not add space', stratumPath)
    }

    // Begin loading and rendering
    stratum.load()

    // If a substratum is opened, ensure that
    // the associated superstratum node looks opened.
    if (ev.parentId) {
      const superStratum = sky.strata[ev.parentId]
      if (superStratum) {
        const superNode = superStratum.getNode(ev.id)
        if (superNode) {
          superNode.open()
        }
      }
    }
    // If a superstratum is opened, ensure that its child node looks opened.
    if (ev.childId) {
      const superNode = stratum.getNode(ev.childId)
      if (superNode) {
        superNode.open()
      }
    }

    // Begin listening strata and nodes.
    stratum.on('stratumrequest', (ev) => {
      // This event tells us that an interaction within the stratum
      // requested a substratum to be built and rendered.
      const parentPath = stratumPath
      const childPath = ev.path

      // Pass to next open
      const subcontext = sky.getSubcontext(parentPath, childPath)

      loader.openChild(parentPath, childPath, subcontext)
    })

    // The first stratum and first content should
    // enable the viewport interaction.
    if (ev.first) {
      // Wait to ensure stratum is in space.
      setTimeout(() => {
        stratum.once('first', () => {
          sky.emit('first')
        })
      }, 0)
    }

    if (ev.childId) {
      stratum.once('final', () => {
        console.log('superstratum loading final:', stratumPath)
        // Position the stratum so that the node matches substratum.
        if (loader.spaces[stratumPath]) {
          // Already in space. OK.
          return
        }

        const spaceAdded = loader.addSpace(stratumPath, stratum.getSpace())
        if (!spaceAdded) {
          // Likely no mapping found yet in case of a superstratum
          console.warn('Could not add space at final:', stratumPath)
        }
      })
    }

    // TODO MAYBE
    // stratum.on('layoutchange', (ev) => {
    //   // Reposition also the substrata
    //   const parentPath = path
    //   loader.remapChildren(parentPath)
    // })
  })

  loader.on('close', (ev) => {
    console.log('space closing', ev)

    // Make the associated node look closed.
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

    // Finally, close the space.
    loader.removeSpace(ev.id)
  })
}
