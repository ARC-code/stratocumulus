const io = require('./io')
const strata = require('./strata')
const tapspace = require('tapspace')
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

  // DEBUG
  toolbar.on('search', (ev) => {
    console.log('search', ev)
  })

  // Init first stratum
  strata.build(viewport)
}
