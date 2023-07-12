const io = require('../io')

module.exports = function () {
  // Begin constructing stratum from the back-end.
  // This makes the stratum alive.
  //

  if (this.alive) {
    // Already listening.
    console.warn('Duplicate stratum.load() call for ' + this.path)
    return
  }
  if (this.loading) {
    // Already loading.
    console.warn('Already loading ' + this.path)
    return
  }

  // Mark that it has or will have content.
  this.alive = true
  this.loading = true

  // Begin listen events for the path.
  io.graphStore.on(this.path, (ev) => {
    // Insert the subgraph received from the server.
    if (!this.alive) {
      // Stratum was removed during fetch.
      return
    }

    // Replace the graph
    this.graph = io.graphStore.get(ev.path)

    // Render the graph and do the layout
    this.render(ev.final)

    // Emit 'first' at the first node.
    if (ev.first) {
      this.emit('first')
    }

    // Emit 'final' event if last message
    if (ev.final) {
      // Register that loading is now finished.
      this.loading = false
      // Signal e.g. viewport that the graph is rendered.
      this.emit('final')
    }
  })

  // Inform the server we are ready to receive the stratum.
  io.graphStore.fetch(this.path, this.context)
}
