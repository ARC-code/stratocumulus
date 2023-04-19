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
  const positionZoomControl = () => {
    zoomControl.match({
      source: zoomControl.atBottomRight(),
      target: this.viewport.atBottomRight().offset(-10, -70)
    })
  }

  // Run at least once. Reposition on viewport resize.
  positionZoomControl()
  const resizeCapturer = this.viewport.capturer('resize')
  resizeCapturer.on('resize', positionZoomControl)
}
