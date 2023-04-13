const stratumView = require('./view')

module.exports = function () {
  // Refresh the rendered stratum.
  // Updates label visibility in a semantic zoom manner.
  //
  if (!this.alive) {
    // Already removed, no need to refresh.
    return
  }

  const viewport = this.space.getViewport()

  if (!viewport) {
    console.warn('Missing viewport in Stratum:refresh()')
    return
  }

  stratumView.refreshLabels(this, viewport)
}
