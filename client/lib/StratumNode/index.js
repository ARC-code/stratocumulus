const tapspace = require('tapspace')

const StratumNode = function (key, attrs, space) {
  // A node in a stratum. Stratum maintains set of nodes.
  //
  // StratumNode inherits Emitter
  //
  // Parameters:
  //   key
  //     string, graph node key
  //   attrs
  //     object, graph node attributes
  //   space
  //     a tapspace.components.Space or Plane.
  //
  // Emits:
  //   open
  //

  // References to sub-node elements.
  // this.circleElement
  // this.labelElement
  // this.countElement

  const newItem = tapspace.createItem('')
  newItem.addClass('stratum-node')

  // Render in this pixel size
  newItem.setSize(256, 256)
  // Gravity at node center
  newItem.setAnchor(newItem.atCenter())
  // Disable interaction with node content.
  newItem.setContentInput(false)

  // Make it easy to find node attributes via tapspace component.
  newItem.nodeKey = key

  // Track if the item is interactive.
  // TODO use future tapspace methods to check this.
  newItem.interactiveNode = false

  this.space = space
  this.space.addChild(newItem)
  this.component = newItem

  this.updateCount(attrs)
}

module.exports = StratumNode
const proto = StratumNode.prototype
proto.isStratumNode = true

// Methods
// proto.getElement // for adding the node to space
proto.disableFaceting = require('./disableFaceting')
proto.enableFaceting = require('./enableFaceting')
proto.getOrigin = require('./getOrigin')
proto.getRadius = require('./getRadius')
// proto.getScale // get current or intented scale? for matching.
proto.makeFaceted = require('./makeFaceted')
proto.remove = require('./remove')
proto.translateTo = require('./translateTo')
proto.updateCount = require('./updateCount')
