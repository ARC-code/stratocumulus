const tapspace = require('tapspace')
const io = require('./io')
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
    console.log('navigation event', ev.context.toContextObject())
    io.contextStore.dispatch({
      type: 'navigation',
      path: ev.context.toFacetPath()
    })
  })

  // Connect search bar
  toolbar.on('search', (ev) => {
    // Filter strata by search query
    io.contextStore.dispatch({
      type: 'filter/keyword',
      keyword: ev.query
    })
  })
  toolbar.on('filter/keyword/clear', (ev) => {
    io.contextStore.dispatch({
      type: 'filter/keyword/clear'
    })
  })
  toolbar.on('filter/years/clear', (ev) => {
    io.contextStore.dispatch({
      type: 'filter/years/clear'
    })
  })

  // Connect time range slider
  slider.on('change', (ev) => {
    io.contextStore.dispatch({
      type: 'filter/years',
      rangeStart: ev.rangeStart,
      rangeEnd: ev.rangeEnd
    })
  })

  // Propagate context changes to the components.
  io.contextStore.subscribe(() => {
    const context = io.contextStore.getState()

    // Refresh context widget
    toolbar.contextForm.setContext(context)

    // Filter Sky by keyword
    if (context.hasParameter('q')) {
      const query = context.getValue('q')
      sky.filterByKeyword(query)
    }

    // Filter Sky by years
    if (context.hasParameter('r_years')) {
      const range = context.getRangeValue('r_years')
      sky.emphasizeDecades(range.rangeStart, range.rangeEnd)
    }
  })
}
