const stratumLib = require('./stratum')
const tapspace = require('tapspace')
const timeSliderMarks = require('toolcool-range-slider/dist/plugins/tcrs-marks.min.js')
const timeSliderLib = require('toolcool-range-slider')
const initViewport = require('./initViewport')

exports.build = function (viewport) {
  // State - the global context.
  // Our application state in a single object.
  const state = {
    strata: {},
    strataTrail: [],
    currentStratum: 0,
    graphTimers: {}
  }

  const timeSlider = document.querySelector('#time-slider')
  let timeSliderTimer = null

  // Setup tapspace
  const space = tapspace.createSpace()
  viewport.addChild(space)

  // Adjust timeSlider styling (can't use stylesheet since component uses shadow-DOM)
  timeSlider.addCSS('.mark-value{ font-family: Arial, Helvetica, sans-serif; }')

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
    const stratum = stratumLib.build(path, context, label, bgColor)

    // Place into space DOM. Stratum (0,0,0) will match with the position.
    space.addChild(stratum.space, position)

    // Keep track of what strata we have built.
    state.strata[path] = stratum
    state.strataTrail.push(stratum.path)
    state.currentStratum = state.strataTrail.length - 1

    stratum.on('stratumrequest', (ev) => {
      // This event tells us that an interaction within the stratum
      // requested a substratum to be built and rendered.
      console.log('stratum ' + path + ' event: stratumrequest for ' + ev.path)
      // Stratum build might be heavy. To avoid blocking click interaction
      // too long, place the build last in the event loop. Thus timeout 0.
      setTimeout(() => {
        // Note the recursive nature of the call.
        createStratum(ev.path, ev.context, ev.label, ev.bgColor, ev.position)
      }, 0)
    })

    stratum.on('final', (ev) => {
      console.log('stratum ' + path + ' event: final')
    })

    return stratum
  }

  const removeStratum = function (path) {
    // Forget stratum and remove it from DOM.
    //

    // Find stratum object.
    const stratum = state.strata[path]

    if (stratum) {
      // Destroy listeners we set during creation.
      stratum.off('stratumrequest')
      stratum.off('final')
      // Remove from DOM.
      space.removeChild(stratum.space)
      // Clean up.
      stratumLib.remove(stratum)
      // Forget
      delete state.strata[path]
    } else {
      // DEBUG else already removed.
      console.warn('Stratum already removed or did not exist: ' + path)
    }
  }

  const refreshLabels = function () {
    // A semantic zoom feature: show labels of nodes that are close enough.
    //
    // DEV NOTE: this looks like a method. Maybe have class for strata?
    //

    // For each stratum
    Object.keys(state.strata).forEach(stratumPath => {
      const stratum = state.strata[stratumPath]
      stratumLib.refresh(stratum)
    })
  }

  // Begin from root stratum /
  const firstPoint = viewport.atCenter()
  const firstStratum = createStratum('/', {}, 'ARC', '#444444', firstPoint)

  // Once the first stratum has been rendered and we have some content in space,
  // make the viewport interactive and begin refreshing labels.
  firstStratum.once('final', () => {
    // Make viewport interactive now when space has content.
    initViewport(viewport)

    // Show/hide labels after zoom
    refreshLabels()
    let zoomTimer = null
    viewport.on('idle', () => {
      clearTimeout(zoomTimer)
      zoomTimer = setTimeout(() => {
        refreshLabels()
      }, 500)
    })

    // Setup time slider
    timeSlider.addEventListener('change', (evt) => {
      clearTimeout(timeSliderTimer)
      timeSliderTimer = setTimeout(() => {
        console.log(`time range start: ${timeSlider.value1}; time range end: ${timeSlider.value2}`)
        // this code is intended to add the time range parameter to the context for any existing strata.
        // TODO: actually fire off an update request and handle nodes that will either resize or possibly
        // disappear/reappear
        for (let path in state.strata) {
          state.strata[path].context['r_years'] = `${timeSlider.value1}to${timeSlider.value2}`
        }
      }, 1500)
    })

    // TODO Take a snapshot
    // TODO Add snapshot to minimap
  })

  return state
}
