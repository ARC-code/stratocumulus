const stratumLib = require('./stratum')
const tapspace = require('tapspace')

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

  // TODO build more than single stratum
  const stratum = stratumLib.buildStratum('/', {}, 'ARC', '#444444', space)

  // Track what strata we have built.
  state.strata['/'] = stratum
  state.strataTrail.push(stratum.path)
  state.currentStratum = state.strataTrail.length - 1

  // Center viewport to stratum.
  stratum.div.affine.translateTo(view.atCenter())

  // Once the first stratum is rendered...
  stratum.once('final', () => {
    // DEBUG show final in console
    console.log('stratum ' + stratum.path + ' event: final')

    // TODO Fit view to the network
    // const stratum_plane = stratum.div.affine
    // stratum_plane.scaleToFit(view)

    // Make viewport zoomable after rendered
    view.pannable()
    // Make viewport

    // Show/hide labels after zoom
    stratumLib.semanticZoom(stratum, space)
    // TODO view.on('idle', () => { ... })
    let zoomTimer = null
    view.capturer('wheel').on('wheel', () => {
      clearTimeout(zoomTimer)
      zoomTimer = setTimeout(() => {
        stratumLib.semanticZoom(stratum, space)
      }, 500)
    })

    // Take a snapshot
    // TODO

    // Add snapshot to minimap
    // TODO minimap.draw_minimap()
  })

  return state
}
