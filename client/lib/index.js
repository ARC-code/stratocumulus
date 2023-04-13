const io = require('./io')
const tapspace = require('tapspace')
const Sky = require('./Sky')
const TimeSlider = require('./TimeSlider')
const Toolbar = require('./Toolbar')
const ViewportManager = require('./ViewportManager')
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

  // Setup tapspace viewport
  const viewportManager = new ViewportManager()
  const viewport = viewportManager.getViewport()

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

  // Init stratum loader and begin loading the first stratum
  const sky = new Sky(viewport)

  // Begin from the root stratum path '/'
  const firstPoint = viewport.atCenter()
  const firstStratum = sky.createStratum(
    '/', // Path
    {}, // Context
    'ARC', // Label
    '#444444', // Color
    firstPoint // Position
  )

  // Once the first stratum has been rendered and we have some content in space,
  // make the viewport interactive and begin refreshing labels.
  firstStratum.once('final', () => {
    // Make viewport interactive now when space has content.
    // TODO enable already after first node.
    viewportManager.enableNavigation()

    // Show/hide labels after zoom
    sky.refreshLabels()
    viewport.on('idle', () => {
      sky.refreshLabels()
    })

    // TODO release time slider
    // TODO Take a snapshot or add a breadcrumb
  })
}
