const io = require('../io')
const stratumModel = require('./model')
const stratumView = require('./view')

module.exports = function () {
  // Begin constructing stratum from the back-end.
  // This makes the stratum alive.
  //

  if (this.alive) {
    // Already listening.
    console.warn('Duplicate stratum.load() call for ' + this.path)
    return
  }

  // Mark that it has or will have content.
  this.alive = true

  // Begin listen events for the path.
  io.stream.on(this.path, (subgraph) => {
    // Insert the subgraph received from the server.
    if (!this.alive) {
      // Stratum was removed during fetch.
      return
    }

    stratumModel.updateGraph(this.graph, subgraph)

    // Determine if final message for graph
    const isFinal = ('stage' in subgraph && subgraph.stage === 'final')

    // Render the graph and do the layout
    stratumView.drawGraph(this, isFinal)

    // TODO if subgraph first and not empty, emit 'first'

    // Emit 'final' event if last message
    if (isFinal) this.emit('final')
  })

  // Inform the server we are ready to receive the stratum.
  io.stream.sendStratumBuildJob(this.path, this.context)
}
