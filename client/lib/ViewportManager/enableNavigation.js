const ZoomControl = require('./ZoomControl')

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
  const zoomControl = new ZoomControl({
    scaleStep: 1.5
  })
  this.viewport.addControl(zoomControl)

  // Position to bottom right corner
  const positionZoomControl = () => {
    zoomControl.match({
      source: zoomControl.atBottomLeft(),
      target: this.viewport.atBottomLeft().offset(10, -70)
    })
  }

  // Run at least once. Reposition on viewport resize.
  positionZoomControl()
  const resizeCapturer = this.viewport.capturer('resize')
  resizeCapturer.on('resize', positionZoomControl)
}
