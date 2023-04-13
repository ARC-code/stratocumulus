const stratumLib = require('./stratum')

module.exports = function (path) {
  // Unregister stratum.
  // Forget stratum and remove it from DOM.
  //

  // Find stratum object.
  const stratum = this.strata[path]

  if (!stratum) {
    // DEBUG else already removed.
    console.warn('Stratum already removed or did not exist: ' + path)
    return
  }

  // Destroy listeners we set during creation.
  stratum.off('stratumrequest')
  stratum.off('final')

  // Remove from DOM.
  this.space.removeChild(stratum.space)
  // Clean up.
  stratumLib.remove(stratum)
  // Forget
  delete this.strata[path]
}
