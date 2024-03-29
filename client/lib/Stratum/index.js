const emitter = require('component-emitter')
const tapspace = require('tapspace')
const RENDER_SIZE = require('../config').rendering.stratumSize

const Stratum = function (context) {
  // @Stratum(context)
  //
  // Inherits Emitter
  //
  // Abstract class for ArtifactStratum and CategoryStratum.
  // All subclasses should expose the same interface for Sky
  // to handle them consistently.
  //
  // Parameters:
  //   context
  //     a Context
  //

  // DEBUG validate arguments
  if (!context || !context.isContext) {
    throw new Error('Invalid stratum context: ' + context)
  }

  // Alive when loading or loaded.
  this.alive = false
  // Keep track if still loading.
  this.loading = false

  // The faceting context.
  this.path = context.toFacetPath() // TODO toStratumPath
  this.context = context

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

  // Create containers for nodes and edges.
  // Create the containers separately so that it is easy to
  // iterate them and control their rendering order.
  const nodePlane = tapspace.createPlane()
  nodePlane.addClass('stratum-plane-nodes')
  const edgePlane = tapspace.createPlane()
  edgePlane.addClass('stratum-plane-edges')
  // Edges must come first in order for nodes to be rendered on top.
  stratumPlane.addChild(edgePlane)
  stratumPlane.addChild(nodePlane)

  // Space components
  this.space = stratumPlane
  this.nodePlane = nodePlane
  this.edgePlane = edgePlane
  // Keep track of rendered nodes. nodeKey -> CategoryNode
  this.renderedNodes = {}
  // Keep track of rendered edges. edgeKey -> StratumEdge
  this.renderedEdges = {}

  // Maintain latent stratum bounding circle.
  // Recomputing can be intensive. Update only when necessary, e.g. at final.
  // Rendering size in pixels.
  this.renderSize = RENDER_SIZE
  const radius = RENDER_SIZE / 2
  const circle = { x: radius, y: radius, z: 0, r: radius / 2 }
  this.boundingCircle = new tapspace.geometry.Circle(this.space, circle)
}

module.exports = Stratum
const proto = Stratum.prototype
proto.isStratum = true

// Inherit
emitter(proto)

// Methods
proto.filter = require('./filter')
proto.getBoundingCircle = require('./getBoundingCircle')
proto.getEverySubcontext = require('./getEverySubcontext')
proto.getBasisForSubstratum = require('./getBasisForSubstratum')
proto.getNodes = require('./getNodes')
proto.getOrigin = require('./getOrigin')
proto.getSpace = require('./getSpace')
proto.getSubcontext = require('./getSubcontext')
proto.getSupercontext = require('./getSupercontext')
proto.recomputeBoundingCircle = require('./recomputeBoundingCircle')
proto.render = require('./render')
proto.scaleNodesToFit = require('./scaleNodesToFit')
proto.serveSubstratum = require('./serveSubstratum')
proto.triggerSubstratum = require('./triggerSubstratum')
