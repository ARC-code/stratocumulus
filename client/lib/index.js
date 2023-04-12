const io = require('./io')
const strata = require('./strata')
const tapspace = require('tapspace')

exports.start = function () {
  // DEBUG message to help dev to differentiate between:
  // - app bundle is ok but we are offline (ok message, no UI action)
  // - app bundle is broken (no message, no UI action)
  console.log('Stratocumulus client started.')
  console.log('tapspace.js v' + tapspace.version)

  // Open SSE stream
  io.stream.connect()

  // Setup tapspace
  const sky = document.querySelector('#sky')
  const viewport = tapspace.createView(sky)

  // Setup search bar
  const searchHtml = '<form id="search-box">' +
    '<input type="text" class="search-text" placeholder="Search" />' +
    '<input type="button" class="search-button" value="Go" />' +
    '</form>'
  const searchBar = tapspace.createControl(searchHtml)
  viewport.addControl(searchBar, viewport.at(10, 10))

  // Init first stratum
  strata.build(viewport)
}
