const io = require('./io')
const tapspace = require('tapspace')
const Context = require('./Context')
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

  // Global filtering context
  let context = new Context()

  // Open SSE stream
  io.stream.connect()

  // Setup tapspace viewport
  const viewportManager = new ViewportManager()
  const viewport = viewportManager.getViewport()

  // Setup search tools
  const toolbar = new Toolbar()
  const toolbarControl = tapspace.createControl(toolbar.getElement())
  toolbarControl.setSize(256, 60)
  viewport.addControl(toolbarControl, viewport.at(10, 12))

  // Setup year range slider
  const slider = new TimeSlider()
  document.body.appendChild(slider.getElement())

  // Init stratum loader and begin loading the first stratum
  const sky = new Sky(viewport)
  // Begin from the root stratum path '/'
  sky.init('/')

  // Once the first stratum has some rendered content,
  // make the viewport interactive and begin refreshing labels.
  sky.once('first', () => {
    // TODO estimated fit to content
    viewport.scaleBy(2, viewport.atCenter())

    // Make viewport interactive as the space has content.
    viewportManager.enableNavigation()
  })

  // Navigation changes current context.
  // TODO rename to 'navigation'
  sky.on('navigation', (ev) => {
    const currentContext = ev.context
    console.log('navigation event', ev.context.toContextObject())
    toolbar.contextForm.setContext(currentContext)
  })

  // Connect search bar
  toolbar.on('search', (ev) => {
    // Filter strata by search query
    // TODO update strata based on the global filtering context object.
    sky.filterByKeyword(ev.query)
    // Update context
    context = context.remove('q').append('q', ev.query)
    // Feed to context form
    toolbar.contextForm.setContext(context)
  })

  toolbar.on('clear', (ev) => {
    // Update context
    context = context.remove(ev.parameter)
    // Feed to context form
    toolbar.contextForm.setContext(context)
    // TODO clear sky context
  })

  // Connect time range slider
  slider.on('change', (ev) => {
    // Update strata based on the year range
    // TODO update strata based on the global filtering context object.
    sky.emphasizeDecades(ev.rangeStart, ev.rangeEnd)
    // Update context
    const rangeValue = ev.rangeStart + 'to' + ev.rangeEnd
    context = context.remove('r_years').append('r_years', rangeValue)
    // Feed to context form
    toolbar.contextForm.setContext(context)
  })
}
