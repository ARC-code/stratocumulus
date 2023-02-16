const stratumModel = require('./model')
const stratumView = require('./view')
const emitter = require('component-emitter')
const io = require('../../io')

module.exports = function (path, context, label, bgColor) {
  // Create a stratum object.
  // The stratum is not yet added to the document.
  // Append stratum.space to a parent space in order to do that.
  //
  // Stratum inherits Emitter
  //
  // Parameters:
  //   path
  //     string, the stratum id
  //   context
  //     object, tells where the user came from.
  //   label
  //     string
  //   bgColor
  //     string, css color
  //
  // Stratum emits:
  //   final
  //     when all subgraphs of the stratum has been loaded and rendered
  //   stratumrequest
  //     when the stratum would like one of its nodes to be opened as
  //     a new stratum.
  //
  // Return
  //   a stratum object.
  //

  // Build valid html-friendly id
  const divId = path.replaceAll('/', 'X')
  // Create container for the stratum
  const stratumSpace = stratumView.createGraphSpace(divId)

  // Create stratum object
  const stratum = {
    id: divId,
    path: path,
    space: stratumSpace,
    graph: stratumModel.createGraph(),
    layout: null,
    label: label,
    imageSrc: null,
    bgColor: bgColor,
    context: Object.assign({}, context),
    alive: true
  }

  // Give stratum object emitter methods: on, off, emit
  emitter(stratum)

  // Begin listen events for the path.
  io.stream.on(path, function (subgraph) {
    // Insert the subgraph received from the server.
    if (stratum.alive) {
      stratumModel.updateGraph(stratum.graph, subgraph)

      // Determine if final message for graph
      const isFinal = ('stage' in subgraph && subgraph.stage === 'final')

      // Render the graph and do the layout
      stratumView.drawGraph(stratum, isFinal)

      // Emit 'final' event if last message
      if (isFinal) stratum.emit('final')
    }
  })

  // Inform the server we are ready to receive the stratum.
  io.stream.sendStratumBuildJob(path, context)

  return stratum
}
