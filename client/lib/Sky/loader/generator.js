const Stratum = require('../../Stratum')

module.exports = (sky, loader) => {
  // Generator for TreeLoader. Generator defines how the loaded spaces
  // are constructed and destructed.
  //
  // Parameters:
  //   sky
  //   loader
  //

  // Generator
  loader.on('open', (ev) => {
    console.log('space opening:', ev)

    const path = ev.id
    const trail = ev.data.trail
    const context = ev.data.context // filtering context for this stratum

    // DEBUG
    if (sky.strata[path]) {
      console.warn('Attempted to recreate existing stratum: ' + path)
      return
    }

    // Create
    const stratum = new Stratum(path, trail, context)
    sky.strata[path] = stratum

    // Add stratum to space via the loader.
    const spaceAdded = loader.addSpace(path, stratum.getSpace())
    if (!spaceAdded) {
      // Likely no mapping found yet in case of a superstratum.
      // Postpone addition to final event.
      console.warn('Could not add space', path)
    }

    // Begin loading and rendering
    stratum.load()

    // If this stratum was opened by a superstratum,
    // ensure that the associated superstratum node looks opened.
    if (ev.parentId) {
      const superStratum = sky.strata[ev.parentId]
      if (superStratum) {
        const superNode = superStratum.getNode(ev.id)
        if (superNode) {
          superNode.open()
        }
      }
    }
    // If this stratum was openend by a substratum,
    // ensure that the associated node looks opened.
    if (ev.childId) {
      const superNode = stratum.getNode(ev.childId)
      if (superNode) {
        superNode.open()
      }
    }

    // Begin listening strata and nodes.
    stratum.on('substratumrequest', (ev) => {
      // This event tells us that an interaction within the stratum
      // requested a substratum to be built and rendered.
      const childPath = ev.path

      // Pass to next open
      const eventData = {
        path: childPath,
        trail: stratum.getSubtrail(),
        context: stratum.getSubcontext(childPath)
      }

      loader.openChild(path, childPath, eventData)
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

    stratum.once('final', () => {
      console.log('stratum loading final:', path)
      if (ev.childId) {
        // Add the stratum to space if not yet added.
        if (loader.hasSpace(path)) {
          // Already in space. OK.
          return
        }

        // Ensure the child node looks opened.
        const superNode = stratum.getNode(ev.childId)
        if (superNode) {
          superNode.open()
        }

        const spaceAdded = loader.addSpace(path, stratum.getSpace())
        if (!spaceAdded) {
          // Likely no mapping found yet in case of a superstratum
          console.warn('Could not add space at final:', path)
        }
      }
    })

    // TODO MAYBE
    // stratum.on('layoutchange', (ev) => {
    //   // Reposition also the substrata
    //   const parentPath = path
    //   loader.remapChildren(parentPath)
    // })
  })

  loader.on('close', (ev) => {
    console.log('space closing:', ev)

    // Make the associated node look closed.
    const superPath = ev.space.stratum.getSuperpath()
    const superStratum = sky.strata[superPath]
    if (superStratum) {
      const superNode = superStratum.getNode(ev.id)
      if (superNode) {
        superNode.close()
      }
    }

    // Remove the contained stratum.
    const closingStratum = sky.strata[ev.id]
    if (closingStratum) {
      // Remove from DOM and stop listeners.
      closingStratum.remove()
      // Forget
      delete sky.strata[ev.id]
    }

    // Finally, close the space.
    loader.removeSpace(ev.id)
  })
}
