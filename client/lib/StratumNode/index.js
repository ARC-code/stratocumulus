const tapspace = require('tapspace')
const labelCache = require('../labelCache')
const emitter = require('component-emitter')

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
  //   openingrequest `{ nodeKey: <string>, item: <Component> }`
  //     when the user interacts with the node in order to open something.
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

  // Interactive attributes for the node
  this.tapToZoom = true
  this.tapToOpen = false
  // Setup interaction
  newItem.tappable({ preventDefault: false })
  newItem.on('tap', (ev) => {
    if (this.tapToZoom) {
      const viewport = this.component.getViewport()
      viewport.translateTo(this.component.atCenter())
      viewport.scaleBy(0.62, this.component.atCenter())
    }

    if (this.tapToOpen) {
      this.emit('openingrequest', {
        nodeKey: this.key,
        item: this.component
      })
      this.component.addClass('faceted-node')
    }
  })

  this.key = key
  this.space = space // TODO move out
  this.space.addChild(newItem) // TODO move out
  this.component = newItem

  // Cache attributes. The real up-to-date attributes are in the graph model.
  this.attributesCache = attrs

  this.updateCount(attrs)
}

module.exports = StratumNode
const proto = StratumNode.prototype
proto.isStratumNode = true

// Inherit
emitter(proto)

// Methods
proto.disableFaceting = require('./disableFaceting')
proto.enableFaceting = require('./enableFaceting')
proto.getOrigin = require('./getOrigin')
proto.getRadius = require('./getRadius')
proto.getScale = require('./getScale')
proto.isFacetable = require('./isFacetable')
proto.isFaceted = require('./isFaceted')
proto.remove = require('./remove')
proto.translateTo = require('./translateTo')
proto.updateCount = require('./updateCount')
