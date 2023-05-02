/* eslint-disable */
const emitter = require('component-emitter')

const StratumNode = function (key, attrs) {
  // A node in a stratum. Stratum maintains set of nodes.
  //
  // StratumNode inherits Emitter
  //
  // Parameters:
  //   key
  //   attrs
  //
  // Emits:
  //   open
  //

  // References to sub-node elements.
  this.circleElement
  this.labelElement
  this.countElement
}

module.exports = StratumNode
const proto = StratumNode.prototype
proto.isStratumNode

// Inherit
emitter(proto)

// Methods
proto.getElement // for adding the node to space
proto.update // and render, for data updates.
proto.getOrigin // get node center for drawing edges
proto.getRadius // for trimming the edges
proto.getScale // get current or intented scale? for matching.
proto.makeFacetable // for enabling node opening and clicking.
proto.openSubstratum // begin substratum loading process. Conflict w/ open ev?
proto.translateTo // move node to position
proto.remove // remove node from space and stop its interaction and listeners
