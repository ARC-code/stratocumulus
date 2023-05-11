module.exports = function (path) {
  // Unregister stratum.
  // Forget stratum and remove it from DOM.
  //
  // Parameters:
  //   path
  //     a stratum path
  //

  // Find stratum object.
  const stratum = this.strata[path]

  if (!stratum) {
    // DEBUG else already removed.
    console.warn('Stratum already removed or did not exist: ' + path)
    return
  }

  // Remove from DOM and stop listeners.
  // TODO remove automatically via FractalLoader
  stratum.remove()
  // Forget
  delete this.strata[path]
}
