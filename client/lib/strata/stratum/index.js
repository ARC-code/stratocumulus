const model = require('./model')
const view = require('./view')
const emitter = require('component-emitter')
const io = require('../../io')

exports.buildStratum = function (path, context, label, bgColor, position, space) {
  // Create a stratum object.
  //
  // Stratum inherits Emitter
  //
  // Parameters:
  //   path
  //     string, the stratum id
  //   context
  //     object
  //   label
  //     string
  //   bgColor
  //     string, css color
  //   position
  //     a tapspace Point at which to draw the graph
  //   space
  //     a tapspace space on which to place the graph
  //
  // Stratum emits:
  //   final
  //     when all subgraphs of the stratum has been loaded and rendered
  //   stratumrequest
  //     when the stratum would like one of its nodes to be opened as
  //     a new stratum.
  //

  // Build valid html-friendly id
  const divId = path.replaceAll('/', 'X')
  // Create container for the stratum
  const networkDiv = view.createNetworkDiv(space, divId)

  // Create stratum object
  const stratum = {
    id: divId,
    path: path,
    div: networkDiv,
    graph: model.createGraph(),
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
      model.updateGraph(stratum.graph, subgraph)

      // Determine if final message for graph
      const isFinal = ('stage' in subgraph && subgraph.stage === 'final')

      // Refresh the layout
      model.performLayout(stratum.graph, isFinal)
      // Render the graph
      view.drawGraph(stratum, position, isFinal)

      // Emit 'final' event if last message
      if (isFinal) stratum.emit('final')
    }
  })

  // Inform the server we are ready to receive the stratum.
  io.stream.sendStratumBuildJob(path, context)

  return stratum
}

exports.semanticZoom = (stratum, space) => {
  const viewport = space.getViewport()

  if (stratum.alive) {
    view.refreshLabels(stratum, viewport)
  }
}
