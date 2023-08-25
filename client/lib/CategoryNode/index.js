require('./style.css')
const StratumNode = require('../StratumNode')
const tapspace = require('tapspace')
const config = require('../config')
const NODE_RENDER_SIZE = config.rendering.categoryNodeSize
const FACETING_THRESHOLD = config.artifacts.threshold

const CategoryNode = function (key, attrs) {
  // A node in a stratum. Stratum maintains set of nodes.
  // A slave component, causes only visual side-effects, model-ignorant.
  //
  // CategoryNode inherits Emitter
  //
  // Parameters:
  //   key
  //     string, graph node key, e.g. "/arc/genres" or "/arc/genres/1234"
  //   attrs
  //     object, the initial graph node attributes.
  //
  // Emits:
  //   openingrequest `{ nodeKey: <string>, item: <Component> }`
  //     when the user interacts with the node in order to open something.
  //

  // Inherit
  StratumNode.call(this)

  // Constant rendering size. Use scaling to "size" nodes.
  const radiusPx = NODE_RENDER_SIZE / 2
  const newItem = tapspace.createNode(radiusPx)
  newItem.addClass('category-node')
  newItem.addClass('stratum-node')

  if (attrs.kind === 'grouping') {
    // Style structure nodes.
    newItem.addClass('grouping-node')
  }
  if (attrs.kind === 'root') {
    // Style root nodes.
    newItem.addClass('root-node')
  }
  if (attrs.isFacetable) {
    // Style facetable nodes.
    newItem.addClass('facetable-node')
  }

  // Gravity at node center
  newItem.setAnchor(newItem.atCenter())
  // Disable interaction with node content.
  newItem.setContentInput(false)

  // Make it easy to find node attributes via tapspace component.
  newItem.nodeKey = key

  // Faceting state.
  this.isFacetNode = (attrs.kind !== 'root' && attrs.kind !== 'grouping')
  this.isExhausted = (!attrs.isFacetable && this.isFacetNode) ||
    attrs.value < FACETING_THRESHOLD
  this.isFacetable = attrs.isFacetable
  this.facetParam = attrs.facetParam || null
  this.facetValue = attrs.facetValue || null
  this.isFaceted = false
  // Interactive attributes for the node
  this.tapToZoom = true
  // Setup interaction
  newItem.tappable({ preventDefault: false })
  newItem.on('tap', (ev) => {
    if (this.tapToZoom) {
      const viewport = this.component.getViewport()
      viewport.animateOnce({ duration: 500 })
      viewport.zoomToFill(this.component, 0.3)
    }

    if (this.isFacetNode && !this.isFaceted) {
      // Send event to be handled in Stratum
      const openingRequest = new window.CustomEvent('openingrequest', {
        bubbles: true,
        detail: this.key
      })
      this.component.element.dispatchEvent(openingRequest)
      // Make look open and loading
      this.makeOpened()
      this.setLoadingAnimation(true)
    }
  })

  this.key = key
  this.component = newItem
}

module.exports = CategoryNode
const proto = CategoryNode.prototype
proto.isCategoryNode = true

// Inherit
Object.assign(proto, StratumNode.prototype)

// Methods
proto.makeClosed = require('./makeClosed')
proto.makeOpened = require('./makeOpened')
proto.render = require('./render')
proto.setLoadingAnimation = require('./setLoadingAnimation')
