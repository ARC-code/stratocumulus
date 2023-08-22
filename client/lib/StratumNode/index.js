const StratumNode = function () {
  // Abstract class for ArtifactNode and CategoryNode.
  // Useful for ensuring Sky can handle nodes through the same interface.
  //

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
proto.setScale = require('./setScale')
proto.translateTo = require('./translateTo')
