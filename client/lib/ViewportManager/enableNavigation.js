const tapspace = require('tapspace')

module.exports = function () {
  // Enable viewport navigation
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
