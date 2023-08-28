module.exports = function () {
  // Destroy the ArtifactStratum. Stop loading and kill listeners.
  // However, does not remove the plane from the DOM.
  //

  if (!this.alive) {
    // Already removed
    return
  }

  this.alive = false

  // Stop all listeners
  this.off()
}
