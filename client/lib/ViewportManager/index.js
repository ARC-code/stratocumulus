const tapspace = require('tapspace')

const ViewportManager = function () {
  // @ViewportManager
  //
  // The viewport manager handles the tapspace.components.Viewport setup.
  // The manager can be used to enable or disable interaction.
  //
  // For example, we would like to avoid user to interact with
  // the viewport before there is something to show.
  // Otherwise a few accidental moves could pan the viewport somewhere
  // where there will be no content.
  //

  this.enabled = false

  const skyElement = document.querySelector('#sky')
  this.viewport = tapspace.createView(skyElement)

  // Allow viewport to receive focus to emit keyboard events.
  this.viewport.focusable()

  // Give viewport focus after click. When in focus, can emit keyboard events.
  this.viewport.tappable()
  this.viewport.on('tap', () => {
    this.viewport.focus()
  })
}

module.exports = ViewportManager
const proto = ViewportManager.prototype

// Methods
proto.enableNavigation = require('./enableNavigation')
proto.getViewport = require('./getViewport')
