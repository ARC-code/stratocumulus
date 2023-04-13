const tapspace = require('tapspace')

module.exports = (view) => {
  // This function prepares the tapspace viewport for interaction
  // and navigation. We would like to avoid user to interact with
  // the viewport before there is something to show. Otherwise
  // a few accidental moves could pan the viewport somewhere
  // where there is no content.
  // Therefore, favorably call the function only after the space has content.
  //

  // Enable viewport pan and zoom via touch, scroll, and keyboard
  view.pannable().zoomable()
  // Make viewport maintain the center under window resize
  view.responsive()
  // Allow viewport to receive focus to emit keyboard events.
  view.focusable()

  // Add basic zoom control
  const zoomControl = new tapspace.components.ZoomControl({
    scaleStep: 1.5
  })
  view.addControl(zoomControl)
  zoomControl.match({
    source: zoomControl.atBottomRight(),
    target: view.atBottomRight().offset(-10, -60)
  })

  // Give viewport focus after click. When in focus, can emit keyboard events.
  view.on('idle', () => {
    view.focus()
  })
}
