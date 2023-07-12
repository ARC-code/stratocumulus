const io = require('../io')

module.exports = function () {
  // Destroy the stratum.
  // TODO only unrender, cache the graph?

  if (!this.alive) {
    // Already removed
    return
  }

  this.alive = false

  // Stop listening further stream events.
  io.graphStore.off(this.path)
  // Stop all listeners
  this.off()
  // Remove from sky.
  // TODO remove via FractalLoader
  this.space.remove()
  // TODO remove each node individually?
}
