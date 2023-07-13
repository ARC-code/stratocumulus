require('./stratumNode.css')
const tapspace = require('tapspace')

const StratumNode = function (key, attrs, space) {
  // A node in a stratum. Stratum maintains set of nodes.
  // A slave component, causes only visual side-effects, model-ignorant.
  //
  // StratumNode inherits Emitter
  //
  // Parameters:
  //   key
  //     string, graph node key, e.g. "/arc/genres" or "/arc/genres/1234"
  //   attrs
  //     object, the initial graph node attributes.
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

  // Constant rendering size 256x256
  const radiusPx = 128
  const newItem = tapspace.createNode(radiusPx)
  newItem.addClass('stratum-node')

  // HACK to gray out nodes we are inside.
  if (attrs.kind !== 'root' && attrs.kind !== 'grouping' && !attrs.isFacetable) {
    newItem.addClass('context-node')
  }

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
      viewport.animateOnce({ duration: 500 })
      viewport.zoomToFill(this.component, 0.3)
    }

    if (this.tapToOpen) {
      // Send event to be handled in Stratum
      const openingRequest = new window.CustomEvent('openingrequest', {
        bubbles: true,
        detail: this.key
      })
      this.component.element.dispatchEvent(openingRequest)
      // Make look open and loading
      this.open()
      this.setLoadingAnimation(true)
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

// Methods
proto.close = require('./close')
proto.disableFaceting = require('./disableFaceting')
proto.enableFaceting = require('./enableFaceting')
proto.getOrigin = require('./getOrigin')
proto.getRadius = require('./getRadius')
proto.getScale = require('./getScale')
proto.isFacetable = require('./isFacetable')
proto.isFaceted = require('./isFaceted')
proto.open = require('./open')
proto.remove = require('./remove')
proto.setLoadingAnimation = require('./setLoadingAnimation')
proto.translateTo = require('./translateTo')
proto.updateCount = require('./updateCount')
