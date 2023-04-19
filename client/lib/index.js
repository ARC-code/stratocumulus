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

  // Once the first stratum has some rendered content,
  // make the viewport interactive and begin refreshing labels.
  firstStratum.once('first', () => {
    // Make viewport interactive as the space has content.
    viewportManager.enableNavigation()

    // Begin to show/hide labels after zoom
    sky.refreshLabels()
    viewport.on('idle', () => {
      sky.refreshLabels()
    })
  })

  // Once the first stratum has been rendered completely, so something.
  firstStratum.once('final', () => {
    // TODO release time slider
    // TODO Take a snapshot or add a breadcrumb
  })

  // Connect search bar
  toolbar.on('search', (ev) => {
    console.log('search', ev)

    sky.filterByKeyword(ev.query)
  })

  // Connect time range slider
  slider.on('change', (ev) => {
    console.log('range', ev.rangeStart, ev.rangeEnd)

    // Update strata based on the year range
    sky.emphasizeDecades(ev.rangeStart, ev.rangeEnd)
  })
}
