const tapspace = require('tapspace')

const ViewportManager = function () {
  // The viewport manager prepares the tapspace Viewport for interaction.
  // We would like to avoid user to interact with
  // the viewport before there is something to show. Otherwise
  // a few accidental moves could pan the viewport somewhere
  // where there is no content.
  // Call manager.enableNavigation when there some content is visible.
  //
  this.enabled = false

  const skyElement = document.querySelector('#sky')
  this.viewport = tapspace.createView(skyElement)

  // Make viewport maintain the center under window resize
  this.viewport.responsive()
  // Allow viewport to receive focus to emit keyboard events.
  this.viewport.focusable()

  // Give viewport focus after click. When in focus, can emit keyboard events.
  this.viewport.on('idle', () => {
    this.viewport.focus()
  })
}

module.exports = ViewportManager
const proto = ViewportManager.prototype

// Methods
proto.enableNavigation = require('./enableNavigation')
proto.getViewport = require('./getViewport')
