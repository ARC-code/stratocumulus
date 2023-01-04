const stratumLib = require('./stratum')
const tapspace = require('tapspace')
const initViewport = require('./initViewport')

exports.build = function () {
  // State - the global context.
  // Our application state in a single object.
  const state = {
    strata: {},
    strataTrail: [],
    currentStratum: 0,
    graphTimers: {}
  }

  // Setup sky
  // const sky = document.getElementById('sky')
  // sky.style.backgroundColor = bgColor

  // Setup tapspace
  const sky = document.querySelector('#sky')
  const space = tapspace.createSpace(sky)
  const view = space.getViewport()

  const createStratum = function (path, context, label, bgColor, position) {
    // Create and start one stratum.
    //
    // Parameters:
    //   path
    //     string, identifies the stratum
    //   context
    //     object
    //   label
    //     string, label for the root node
    //   bgColor
    //     string, css color for the root node
    //   position
    //     tapspace Point, the position of the root node.
    //
    // Return:
    //   a stratum. If a stratum with the path already exists, the existing
    //   one is returned.
    //
    // DEV NOTE: this looks like a method. Maybe have class for strata?
    //

    // Ensure we do not create duplicate strata.
    if (state.strata[path]) {
      console.warn('Attempted to recreate existing stratum: ' + path)
      return state.strata[path]
    }

    // Build and render
    const stratum = stratumLib.buildStratum(path, context, label,
      bgColor, position, space)

    // Keep track of what strata we have built.
    state.strata['/'] = stratum
    state.strataTrail.push(stratum.path)
    state.currentStratum = state.strataTrail.length - 1

    stratum.on('stratumrequest', (ev) => {
      // Some interaction within the stratum requested to render a substratum.
      console.log('stratum ' + path + ' event: stratumrequest for ' + ev.path)
      // Stratum build might be heavy. To avoid blocking click interaction
      // too long, place the build last in the event loop. Thus timeout 0.
      setTimeout(() => {
        createStratum(ev.path, ev.context, ev.label, ev.bgColor, ev.position)
      }, 0)
    })

    stratum.on('final', (ev) => {
      console.log('stratum ' + path + ' event: final')
    })

    return stratum
  }

  // TODO deleteStratum = function (path) { ... }

  const refreshLabels = function () {
    // A semantic zoom feature: show labels of nodes that are close enough.
    //
    // DEV NOTE: this looks like a method. Maybe have class for strata?
    //

    // For each stratum
    Object.keys(state.strata).forEach(stratumId => {
      const stratum = state.strata[stratumId]
      stratumLib.semanticZoom(stratum, space)
    })
  }

  // Begin from root stratum /
  const firstStratum = createStratum('/', {}, 'ARC', '#444444', view.atCenter())

  // Once the first stratum has been rendered and we have some content in space,
  // make the viewport interactive and begin refreshing labels.
  firstStratum.once('final', () => {
    // Make viewport interactive now when space has content.
    initViewport(view)

    // Show/hide labels after zoom
    refreshLabels()
    // TODO view.on('idle', () => { ... })
    let zoomTimer = null
    view.capturer('wheel').on('wheel', () => {
      clearTimeout(zoomTimer)
      zoomTimer = setTimeout(() => {
        refreshLabels()
      }, 500)
    })

    // TODO Take a snapshot
    // TODO Add snapshot to minimap
  })

  return state
}
