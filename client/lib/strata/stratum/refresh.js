const stratumView = require('./view')

module.exports = (stratum) => {
  // Refresh the rendered stratum.
  // Updates label visibility in a semantic zoom manner.
  //
  const viewport = stratum.space.getViewport()

  if (stratum.alive && viewport) {
    stratumView.refreshLabels(stratum, viewport)
  }
}
