const stratumModel = require('./model')
const emitter = require('component-emitter')
const tapspace = require('tapspace')
const graphCache = require('../graphCache')

const Stratum = function (path, superpath, context, label) {
  // A tree graph laid on a plane.
  // The stratum is not yet added to the document.
  // Append stratum.space to a parent space in order to do that.
  //
  // Stratum inherits Emitter
  //
  // Parameters:
  //   path
  //     string, the stratum id
  //   superpath
  //     string, the superstratum id or null if this is root stratum.
  //   context
  //     object, defines the faceting and filtering context of the stratum.
  //   label
  //     string
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

  // Create container for the stratum
  const stratumPlane = tapspace.createPlane()
  stratumPlane.addClass('stratum-plane')
  // Allow fast filtering of strata from all other components.
  stratumPlane.isStratum = true
  // Allow references from component to Stratum.
  // This is a circular reference which usually is a bad thing.
  // However, the stratum and its plane are tightly coupled and
  // we need the ability to reference them to both directions,
  // so the circular reference here is better than some additional index.
  stratumPlane.stratum = this

  const nodePlane = tapspace.createPlane()
  nodePlane.addClass('stratum-plane-nodes')
  const edgePlane = tapspace.createPlane()
  edgePlane.addClass('stratum-plane-edges')
  // Edges must come first in order for nodes to be rendered on top.
  stratumPlane.addChild(edgePlane)
  stratumPlane.addChild(nodePlane)

  // stratum identifier: path
  this.path = path
  // The parent stratum, if any.
  this.superpath = superpath
  // space component
  this.space = stratumPlane
  this.nodePlane = nodePlane
  this.edgePlane = edgePlane
  // graph model
  this.graph = stratumModel.createGraph()
  //
  this.label = label
  // Navigation context. Contains all the filtering settings
  // that define the content of the stratum.
  // For example, stratum "/arc/federations/63a0" may have context:
  //   { f_federations.id: "63a0", r_years: "1000to2000" }
  this.context = Object.assign({}, context)
  // Alive when loading or loaded.
  this.alive = false
  // Keep track if still loading
  this.loading = false
  // Keep track of rendered nodes. nodeKey -> StratumNode
  this.renderedNodes = {}
  // Keep track of rendered edges. edgeKey -> StratumEdge
  this.renderedEdges = {}
  // Context label element displays information about the filtering context
  this.contextLabel = null
  // Maintain latent stratum bounding circle.
  // Recomputing can be intensive. Update only when necessary, e.g. at final.
  const circle = { x: 0, y: 0, z: 0, r: 500 }
  this.boundingCircle = new tapspace.geometry.Circle(this.space, circle)

  // Cache the graph so that it is not lost if the stratum gets removed.
  // TODO Is this just premature optimization?
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
proto.getBoundingCircle = require('./getBoundingCircle')
proto.getNode = require('./getNode')
proto.getNodes = require('./getNodes')
proto.getOrigin = require('./getOrigin')
proto.getSpace = require('./getSpace')
proto.findNodeNear = require('./findNodeNear')
proto.openNode = require('./openNode')
proto.prune = require('./prune')
proto.recomputeBoundingCircle = require('./recomputeBoundingCircle')
proto.refreshLayout = require('./refreshLayout')
proto.remove = require('./remove')
// TODO proto.removeEdges
proto.render = require('./render')
// TODO proto.renderNodes
// TODO proto.renderEdges
proto.renderContextLabel = require('./renderContextLabel')
proto.revealLabels = require('./revealLabels')
// TODO setLabel? The large label below the stratum.
// TODO Or render the label automatically when the context is modified?
