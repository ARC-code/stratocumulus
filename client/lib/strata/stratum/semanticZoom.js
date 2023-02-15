const stratumView = require('./view')

module.exports = (stratum, space) => {
  const viewport = space.getViewport()

  if (stratum.alive) {
    stratumView.refreshLabels(stratum, viewport)
  }
}
