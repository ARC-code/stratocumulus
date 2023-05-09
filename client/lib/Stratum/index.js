const stratumModel = require('./model')
const emitter = require('component-emitter')
const tapspace = require('tapspace')
const graphCache = require('../graphCache')

const Stratum = function (path, context, label, bgColor) {
  // A tree graph laid on a plane.
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
  //   first
  //     when the first node has been loaded and rendered.
  //   final
  //     when all subgraphs of the stratum has been loaded and rendered.
  //   stratumrequest
  //     when the stratum would like one of its nodes to be opened as
  //     a new stratum.
  //

  // Build valid html-friendly id. TODO remove id if unused.
  const divId = path.replaceAll('/', 'X')
  // Create container for the stratum
  const stratumPlane = tapspace.createPlane()
  stratumPlane.addClass('stratum-plane')
  const nodePlane = tapspace.createPlane()
  nodePlane.addClass('stratum-plane-nodes')
  const edgePlane = tapspace.createPlane()
  edgePlane.addClass('stratum-plane-edges')
  // Edges must come first in order for nodes to be rendered on top.
  stratumPlane.addChild(edgePlane)
  stratumPlane.addChild(nodePlane)

  // space element id
  this.id = divId
  // stratum identifier: path
  this.path = path
  // space component
  this.space = stratumPlane
  this.nodePlane = nodePlane
  this.edgePlane = edgePlane
  // graph model
  this.graph = stratumModel.createGraph()
  //
  this.layout = null
  //
  this.label = label
  //
  this.imageSrc = null
  // Initial node color?
  this.bgColor = bgColor
  // Navigation context
  this.context = Object.assign({}, context)
  // Alive when loading or loaded.
  this.alive = false
  // Keep track if still loading
  this.loading = false
  // Keep track of rendered nodes. nodeKey -> StratumNode
  this.renderedNodes = {}
  // Keep track of rendered edges. edgeKey -> StratumEdge
  this.renderedEdges = {}
  // Context label element provides information about the filtering context
  this.contextLabel = null

  // Cache the graph so that it is not lost if the stratum gets removed.
  graphCache.store(path, this.graph)
}

module.exports = Stratum
const proto = Stratum.prototype

// Inherit
emitter(proto)

// Methods
proto.emphasizeDecades = require('./emphasizeDecades')
proto.enableFaceting = require('./enableFaceting')
proto.filterByKeyword = require('./filterByKeyword')
proto.load = require('./load')
proto.getSpace = require('./getSpace')
proto.prune = require('./prune')
proto.refreshLayout = require('./refreshLayout')
proto.remove = require('./remove')
proto.render = require('./render')
proto.renderContextLabel = require('./renderContextLabel')
proto.revealLabels = require('./revealLabels')
// TODO setLabel? The large label below the stratum.
// TODO Or render the label automatically when the context is modified?
