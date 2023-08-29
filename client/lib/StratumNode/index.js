const StratumNode = function (key, data) {
  // Abstract class for ArtifactNode and CategoryNode.
  // Useful for ensuring Sky can handle nodes through the same interface.
  //
  // Parameters:
  //   key
  //     a string, the node ID, stratum-specific
  //   data
  //     an object, the node data object required for rendering.
  //

  // Common properties
  this.key = key
  this.data = data || null

  // Force subclasses to init component
  this.component = null
}

module.exports = StratumNode
const proto = StratumNode.prototype
proto.isStratumNode = true

// Methods
proto.getOrigin = require('./getOrigin')
proto.getRadius = require('./getRadius')
proto.remove = require('./remove')
proto.render = require('./render')
proto.setScale = require('./setScale')
proto.translateTo = require('./translateTo')
proto.update = require('./update')
