const io = require('../io')

module.exports = function () {
  // @CategoryStratum:remove()
  //
  // Destroy the stratum. Stop loading and kill listeners.
  // However, does not remove the stratum from the DOM.
  //
  if (!this.alive) {
    // Already removed
    return
  }

  this.alive = false

  // Stop listening further stream events.
  io.graphStore.unsubscribe(this.context)
  // Stop all listeners
  this.off()
  // TODO remove each node individually?
}
