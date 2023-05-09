const io = require('./io')
const tapspace = require('tapspace')
const Sky = require('./Sky')
const TimeSlider = require('./TimeSlider')
const Toolbar = require('./Toolbar')
const ViewportManager = require('./ViewportManager')
const clientVersion = require('./version')

// TEMP, patch tapspace
tapspace.interaction.WheelZoom = require('./WheelZoom')
tapspace.interaction.KeyboardZoom = require('./KeyboardZoom')
tapspace.components.BasisComponent.prototype.isPlanar = () => true
tapspace.components.TransformerComponent.prototype.isPlanar = () => true
tapspace.components.Hyperspace.prototype.isPlanar = () => true
tapspace.components.Plane.prototype.isPlanar = () => true
tapspace.components.Space.prototype.isPlanar = () => true

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
  const firstScale = viewport.getScale()
  const firstStratum = sky.createStratum(
    '/', // Path
    {}, // Context
    'ARC', // Label
    '#444444', // Color
    firstPoint, // Position
    firstScale // Scale
  )

  // Once the first stratum has some rendered content,
  // make the viewport interactive and begin refreshing labels.
  firstStratum.once('first', () => {
    // Make viewport interactive as the space has content.
    viewportManager.enableNavigation()

    // Begin to manage visibility and loading of things after navigation.
    // - show/hide labels
    // - detect current stratum
    // - open/close nodes.
    viewport.on('idle', () => {
      sky.refreshSpaces()
    })

    // Also, show/hide labels after the first.
    sky.refreshSpaces()
  })

  // Once the first stratum has been rendered completely, so something.
  firstStratum.once('final', () => {
    sky.refreshSpaces()
    // TODO release time slider
    // TODO Take a snapshot or add a breadcrumb
  })

  // Connect search bar
  toolbar.on('search', (ev) => {
    // Filter strata by search query
    sky.filterByKeyword(ev.query)
  })

  // Connect time range slider
  slider.on('change', (ev) => {
    // Update strata based on the year range
    sky.emphasizeDecades(ev.rangeStart, ev.rangeEnd)
  })
}
