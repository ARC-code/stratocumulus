module.exports = function () {
  // Destroy the ArtifactStratum. Stop loading and kill listeners.
  // However, does not remove the plane from the DOM.
  //

  // Stop all listeners
  this.off()
}
