const Stratum = require('../../Stratum')
const io = require('../../io')

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
    // DEBUG
    // console.log('space opening:', ev)

    const path = ev.id
    const context = ev.data.context // filtering context for this stratum

    // DEBUG
    if (sky.strata[path]) {
      console.warn('Attempted to recreate existing stratum: ' + path, ev)
      return
    }

    // Create
    const stratum = new Stratum(context)
    sky.strata[path] = stratum

    // Populate with a single node. This node will be upgraded later.
    // TODO smells hacky
    if (ev.childId && stratum.graph.order === 0) {
      const subStratum = sky.strata[ev.childId]
      if (subStratum) {
        const lastFacet = subStratum.context.getLastFacet()
        const nodeKey = subStratum.context.toNodeKey()
        const label = io.labelStore.read(lastFacet.parameter, lastFacet.value)
        io.graphStore.provide(context, {
          id: nodeKey,
          kind: lastFacet.kind, // TODO do not use parameter-based kind, sketcy
          label: label || '', // will be replaced in load
          is_facetable: true,
          facet_param: lastFacet.parameter,
          facet_value: lastFacet.value
        })
      }
    }

    // Attempt to render.
    stratum.render(false, 1)

    // Add stratum to space via the loader.
    const spaceAdded = loader.addSpace(path, stratum.getSpace())
    if (!spaceAdded) {
      // Likely no mapping found yet in case of a superstratum.
      // This is ok. Postpone addition to final event.
      console.warn('Could not add space', path)
    }

    // Begin loading (and rendering at each incoming event)
    stratum.load()

    // If this stratum was opened by a superstratum,
    // ensure that the associated superstratum node looks opened.
    // Also start loading animation on the node.
    if (ev.parentId) {
      const superStratum = sky.strata[ev.parentId]
      if (superStratum) {
        const superNode = superStratum.getFacetNode(path)
        if (superNode) {
          superNode.makeOpened()
          superNode.setLoadingAnimation(true)
        }
      }
    }
    // If this stratum was openend by a substratum,
    // ensure that the associated node looks opened.
    if (ev.childId) {
      const superNode = stratum.getFacetNode(ev.childId)
      if (superNode) {
        superNode.makeOpened()
        superNode.setLoadingAnimation(true)
      }
    }

    // Begin listening strata and nodes.
    stratum.on('substratumrequest', (rev) => {
      // This event tells us that an interaction within the stratum
      // requested a substratum to be built and rendered.
      const childPath = rev.context.toFacetPath()
      // Pass to next open
      const eventData = { context: rev.context }
      loader.openChild(path, childPath, eventData)
    })

    // Backtracked parent can be rendered only after final.
    stratum.once('final', () => {
      // Add the stratum to space if not yet added.
      if (ev.childId) {
        if (!loader.hasSpace(path)) {
          // Add if not yet added.
          const spaceAdded = loader.addSpace(path, stratum.getSpace())
          if (!spaceAdded) {
            // Likely no mapping found yet in case of a superstratum
            console.warn('Could not add space at final:', path)
            return
          }
        }

        // Ensure the child node looks opened.
        // Also stop loading animation, if any.
        const superNode = stratum.getFacetNode(ev.childId)
        if (superNode) {
          superNode.makeOpened()
          superNode.setLoadingAnimation(false)
        }
      }

      // Ensure the node in the parent stratum looks opened.
      // Also stop loading animation, if any.
      if (ev.parentId) {
        const superStratum = sky.strata[ev.parentId]
        if (superStratum) {
          const superNode = superStratum.getFacetNode(path)
          if (superNode) {
            superNode.makeOpened()
            superNode.setLoadingAnimation(false)
          }
        }
      }
    })

    // When stratum layout changes, reposition the substrata
    stratum.on('layout', (ev) => {
      loader.remapChildren(path)
    })
  })

  // The first stratum and first content should
  // enable the viewport interaction.
  loader.once('opened', (ev) => {
    const stratum = ev.space.stratum
    // Wait to ensure stratum is in space.
    setTimeout(() => {
      stratum.once('first', () => {
        sky.emit('first')
      })
    }, 0)
  })

  loader.on('close', (ev) => {
    // DEBUG
    // console.log('space closing:', ev)

    // Make the associated node look closed.
    const path = ev.id
    const superPath = ev.space.stratum.getSuperpath()
    const superStratum = sky.strata[superPath]
    if (superStratum) {
      const superNode = superStratum.getFacetNode(path)
      if (superNode) {
        superNode.makeClosed()
      }
    }

    // Remove the contained stratum.
    const closingStratum = sky.strata[path]
    if (closingStratum) {
      // Remove from DOM and stop listeners.
      closingStratum.remove()
      // Forget
      delete sky.strata[path]
    }

    // Finally, close the space.
    loader.removeSpace(path)
  })
}
