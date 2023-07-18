require('./stratum.css')
const emitter = require('component-emitter')
const tapspace = require('tapspace')
const io = require('../io')

const Stratum = function (context) {
  // @Stratum
  //
  // A tree graph laid on a plane.
  // The stratum is not yet added to the document.
  // Append stratum.space to a parent space in order to do that.
  //
  // Stratum inherits Emitter
  //
  // Parameters:
  //   context
  //     a Context. The context gives identity to the stratum and
  //     .. defines the faceting and filtering of its content.
  //
  // Stratum emits:
  //   first
  //     when the first node has been loaded and rendered.
  //   final
  //     when all subgraphs of the stratum has been loaded and rendered.
  //   substratumrequest
  //     when the stratum would like one of its nodes to be opened as
  //     a new stratum.
  //

  // DEBUG validate arguments
  if (!context || !context.isContext) {
    throw new Error('Invalid stratum context: ' + context)
  }

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

  // The faceting context.
  this.path = context.toFacetPath()
  this.context = context

  // Alive when loading or loaded.
  this.alive = false
  // Keep track if still loading.
  this.loading = false

  // Space components
  this.space = stratumPlane
  this.nodePlane = nodePlane
  this.edgePlane = edgePlane
  // Keep track of rendered nodes. nodeKey -> StratumNode
  this.renderedNodes = {}
  // Keep track of rendered edges. edgeKey -> StratumEdge
  this.renderedEdges = {}
  // Context label element displays information about the filtering context
  this.contextLabel = null

  // Maintain index of facet paths to node keys.
  // Otherwise finding nodes by facet path is very tedious.
  // facetPath -> nodeKey
  this.facetNodeIndex = {}

  // Maintain latent stratum bounding circle.
  // Recomputing can be intensive. Update only when necessary, e.g. at final.
  const circle = { x: 0, y: 0, z: 0, r: 500 }
  this.boundingCircle = new tapspace.geometry.Circle(this.space, circle)

  // Read-only graph model
  this.graph = io.graphStore.get(this.context)
}

module.exports = Stratum
const proto = Stratum.prototype

// Inherit
emitter(proto)

// Methods
proto.emphasizeDecades = require('./emphasizeDecades')
proto.enableFaceting = require('./enableFaceting')
proto.filterByKeyword = require('./filterByKeyword')
proto.getBoundingCircle = require('./getBoundingCircle')
proto.getFacetNode = require('./getFacetNode')
proto.getNodes = require('./getNodes')
proto.getOrigin = require('./getOrigin')
proto.getSpace = require('./getSpace')
proto.getSubcontext = require('./getSubcontext')
proto.getSubpaths = require('./getSubpaths')
proto.getSupercontext = require('./getSupercontext')
proto.getSuperpath = require('./getSuperpath')
proto.load = require('./load')
proto.prune = require('./prune')
proto.recomputeBoundingCircle = require('./recomputeBoundingCircle')
proto.refreshLayout = require('./refreshLayout')
proto.refreshNodeSizes = require('./refreshNodeSizes')
proto.remove = require('./remove')
// TODO proto.removeEdges
proto.render = require('./render')
// TODO proto.renderNodes
// TODO proto.renderEdges
proto.renderContextLabel = require('./renderContextLabel')
proto.revealLabels = require('./revealLabels')
