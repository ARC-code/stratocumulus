const stratumView = require('./view')

module.exports = (stratum, space) => {
  // Refresh the rendered stratum.
  // Updates label visibility in a semantic zoom manner.
  //
  const viewport = space.getViewport()

  if (stratum.alive) {
    stratumView.refreshLabels(stratum, viewport)
  }
}
