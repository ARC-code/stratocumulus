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

    const superstratumPath = ev.parentId || null
    const substratumPath = ev.childId || null
    const context = ev.data
    // const context = {}
    const label = 'todo'

    // DEBUG
    if (sky.strata[stratumPath]) {
      console.warn('Attempted to recreate existing stratum: ' + stratumPath)
      return
    }

    const stratum = new Stratum(stratumPath, superstratumPath, context, label)

    // Add stratum to space via the loader.
    const spaceAdded = loader.addSpace(stratumPath, stratum.getSpace())
    if (spaceAdded) {
      sky.strata[stratumPath] = stratum
    } else {
      console.warn('Could not add space', stratumPath)
      return
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
