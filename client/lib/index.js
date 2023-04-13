const io = require('./io')
const strata = require('./strata')
const tapspace = require('tapspace')
const TimeSlider = require('./TimeSlider')
const Toolbar = require('./Toolbar')
const clientVersion = require('./version')

exports.start = function () {
  // DEBUG message to help dev to differentiate between:
  // - app bundle is ok but we are offline (ok message, no UI action)
  // - app bundle is broken (no message, no UI action)
  // - app bundle is cached (ok message, old versions)
  console.log('stratocumulus-client v' + clientVersion)
  console.log('tapspace.js v' + tapspace.version)

  // Open SSE stream
  io.stream.connect()

  // Setup tapspace
  const sky = document.querySelector('#sky')
  const viewport = tapspace.createView(sky)

  // Setup search tools
  const toolbar = new Toolbar()
  const toolbarControl = tapspace.createControl(toolbar.getElement())
  toolbarControl.setSize(250, 60)
  viewport.addControl(toolbarControl, viewport.at(10, 12))

  // Setup year range slider
  const slider = new TimeSlider()
  document.body.appendChild(slider.getElement())

  // DEBUG
  toolbar.on('search', (ev) => {
    console.log('search', ev)
  })

  slider.on('change', (ev) => {
    console.log('range', ev)

    // Add the time range parameter to the context for any existing strata.
    // Do this after the stratum is complete.
    // TODO: actually fire off an update request and handle nodes
    // that will either resize or possibly disappear/reappear
    // for (let path in state.strata) {
    //   state.strata[path].context['r_years'] = `${timeSlider.value1}to${timeSlider.value2}`
    // }
  })

  // Init first stratum
  strata.build(viewport)
}
