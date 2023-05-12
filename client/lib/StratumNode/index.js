const tapspace = require('tapspace')
const labelCache = require('../labelCache')

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

  // HACK cache node labels for stratum context labels
  labelCache.store(attrs.facetParam, attrs.facetValue, attrs.label)

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

  // Track if the item is interactive for faceting.
  this.facetingEnabled = false
  // Make interactive for navigational tap.
  newItem.tappable({ preventDefault: false })
  this.ontap = () => {}
  newItem.on('tap', (ev) => (
    this.ontap(ev)
  ))

  this.key = key
  this.space = space
  this.space.addChild(newItem)
  this.component = newItem

  // Cache attributes. The real up-to-date attributes are in the graph model.
  this.attributesCache = attrs

  this.updateCount(attrs)
  this.enableFocusing()
}

module.exports = StratumNode
const proto = StratumNode.prototype
proto.isStratumNode = true

// Methods
proto.disableFaceting = require('./disableFaceting')
proto.enableFaceting = require('./enableFaceting')
proto.enableFocusing = require('./enableFocusing')
proto.getOrigin = require('./getOrigin')
proto.getRadius = require('./getRadius')
proto.getScale = require('./getScale')
proto.isFacetable = require('./isFacetable')
proto.isFaceted = require('./isFaceted')
proto.makeFaceted = require('./makeFaceted')
proto.remove = require('./remove')
proto.translateTo = require('./translateTo')
proto.updateCount = require('./updateCount')
