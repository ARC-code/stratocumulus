const tapspace = require('tapspace')

module.exports = function () {
  // @ViewportManager:enableNavigation()
  //
  // Enable viewport navigation: cursor panning, wheel zooming, zoom buttons,
  // and others.
  //
  // It is recommended to call this only after the space has
  // some visible content so that user does not get lost into empty space.
  //

  // Prevent double enabling
  if (this.enabled) {
    return
  }
  this.enabled = true

  // Enable viewport pan and zoom via touch, scroll, and keyboard
  this.viewport.pannable().zoomable()

  // Add basic zoom control
  const zoomControl = new tapspace.components.ZoomControl({
    scaleStep: 1.5
  })
  this.viewport.addControl(zoomControl)

  // Position to bottom right corner
  zoomControl.match({
    source: zoomControl.atBottomLeft(),
    target: this.viewport.atBottomLeft().offset(10, -70)
  })
}
