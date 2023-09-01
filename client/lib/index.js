const tapspace = require('tapspace')
const io = require('./io')
const Sky = require('./Sky')
const TimeSlider = require('./TimeSlider')
const Toolbar = require('./Toolbar')
const ViewportManager = require('./ViewportManager')
const PathManager = require('./PathManager')
const ReduxStore = require('./ReduxStore')
const reducer = require('./reducer')
const clientVersion = require('./version')

exports.start = function () {
  // DEBUG log messages to help developer to differentiate between:
  // - app bundle is ok but we are offline (ok messages, no UI action)
  // - app bundle is broken (no messages, no UI action)
  // - app bundle is cached (ok messages, old versions)
  console.log('stratocumulus-client v' + clientVersion)
  console.log('tapspace.js v' + tapspace.version)

  // Open SSE stream
  io.stream.connect()
  // State management.
  const store = new ReduxStore({}, reducer)

  // Setup tapspace viewport
  const viewportManager = new ViewportManager()
  const viewport = viewportManager.getViewport()

  // Setup search tools
  const toolbar = new Toolbar()
  const toolbarControl = tapspace.createControl(toolbar.getElement())
  toolbarControl.setSize(256, 60)
  viewport.addControl(toolbarControl, viewport.at(12, 12))
  toolbar.configure()

  // Setup year range slider
  const slider = new TimeSlider()
  document.body.appendChild(slider.getElement())

  // Setup URL management
  const pathManager = new PathManager()

  // Init stratum loader.
  // The loader does not yet begin loading the first stratum.
  // Instead, the first stratum is loaded in the state store listener below.
  const sky = new Sky(viewport)


  // Once the first stratum has some rendered content,
  // make the viewport interactive and begin refreshing labels.
  sky.once('loading', () => {
    // Already some loading animations might be visible.
    // Fit to content
    const bbox = viewport.hyperspace.getBoundingBox()
    viewport.zoomToFill(bbox, 0.2)
  })
  sky.once('first', () => {
    // Fit to content
    const bbox = viewport.hyperspace.getBoundingBox()
    viewport.zoomToFill(bbox, 0.9)
    viewport.hyperspace.commit() // TODO not needed. Repair in tapspace.
    // Make viewport interactive as the space has content.
    viewportManager.enableNavigation()
  })

  // Navigation changes current context.
  sky.on('navigation', (ev) => {
    console.log('navigation event', ev.context.toFacetPath())
    store.dispatch({
      type: 'navigation',
      path: ev.context.toFacetPath()
    })
  })

  // Connect search bar and other tools.
  toolbar.on('search', (ev) => {
    store.dispatch(ev)
  })
  toolbar.on('clear', (ev) => {
    store.dispatch(ev)
  })

  // Connect time range slider
  slider.on('change', (ev) => {
    store.dispatch({
      type: 'filter/years',
      rangeStart: ev.rangeStart,
      rangeEnd: ev.rangeEnd
    })
  })

  // Propagate context state changes to the components.
  store.subscribe(() => {
    const state = store.getState()
    const context = state.context

    // Refresh context widget and search bar to reflect the new context.
    toolbar.setContext(context)

    // Navigate to current position.
    if (state.currentNode) {
      const facetParam = state.currentNode.parameter
      const facetValue = state.currentNode.value
      sky.navigateToNode(context, facetParam, facetValue)
    } else {
      sky.navigateToStratum(context)
    }

    // Filter strata
    sky.filter(context)

    // Set slider range.
    if (context.hasParameter('r_years')) {
      const range = context.getRangeValue('r_years')
      slider.setRange(range)
    }

    // Update URL
    pathManager.setContext(context)
  })

  // Begin loading the first space.
  store.dispatch({
    type: 'init',
    context: pathManager.getContext()
  })
}
