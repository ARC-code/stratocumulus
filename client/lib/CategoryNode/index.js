require('./style.css')
const StratumNode = require('../StratumNode')
const tapspace = require('tapspace')
const config = require('../config')
const NODE_RENDER_SIZE = config.rendering.categoryNodeSize
const FACETING_THRESHOLD = config.artifacts.threshold

const CategoryNode = function (key, attrs) {
  // @CategoryNode(key, attrs)
  //
  // Inherits ArtifactNode
  //
  // A node in a stratum. Stratum maintains set of nodes.
  // A slave component, causes only visual side-effects, model-ignorant.
  //
  // Parameters:
  //   key
  //     string, graph node key, e.g. "/arc/genres" or "/arc/genres/1234"
  //   attrs
  //     object, the node attributes from the graph.
  //
  // Emits:
  //   openingrequest `{ nodeKey: <string>, item: <Component> }`
  //     when the user interacts with the node in order to open something.
  //

  // Inherit
  StratumNode.call(this, key, attrs)

  // Node typing
  this.isRootNode = this.data.kind === 'root'
  this.isGroupingNode = this.data.kind === 'grouping'
  this.isFacetNode = (!this.isRootNode && !this.isGroupingNode)
  this.isFacetable = this.data.isFacetable
  this.isExhausted = (!this.isFacetable && this.isFacetNode) ||
    this.data.value < FACETING_THRESHOLD
  // this.isGateNode =  this.isExhausted || this.data.value < FACETING_THRESHOLD
  // TODO read from data
  this.facetParam = this.data.facetParam || null
  this.facetValue = this.data.facetValue || null

  // Constant rendering size. Use scaling to "size" nodes.
  const radiusPx = NODE_RENDER_SIZE / 2
  const newItem = tapspace.createNode(radiusPx)
  newItem.addClass('category-node')
  newItem.addClass('stratum-node')
  // Make it easy to find node attributes via tapspace component.
  newItem.nodeKey = this.key

  if (this.isGroupingNode) {
    // Style structure nodes.
    newItem.addClass('grouping-node')
  }
  if (this.isRootNode) {
    // Style root nodes.
    newItem.addClass('root-node')
  }
  if (this.isFacetNode) {
    // Style facetable nodes.
    newItem.addClass('facetable-node')
  }

  // Gravity at node center
  newItem.setAnchor(newItem.atCenter())
  // Disable interaction with node content.
  newItem.setContentInput(false)

  // Faceting state.
  this.isFaceted = false
  // Interactive attributes for the node
  this.tapToZoom = true
  // Setup interaction
  newItem.tappable({ preventDefault: false })
  newItem.on('tap', (ev) => {
    if (this.tapToZoom) {
      // View root nodes farther
      let relativeSize = 0.4
      if (this.isGroupingNode) {
        relativeSize = 0.25
      } else if (this.isRootNode) {
        relativeSize = 0.15
      }
      const viewport = this.component.getViewport()
      viewport.animateOnce({ duration: 500 })
      viewport.zoomToFill(this.component, relativeSize)
    }

    if (this.isFacetNode && !this.isFaceted) {
      // Send event to be handled in Stratum
      const openingRequest = new window.CustomEvent('openingrequest', {
        bubbles: true,
        detail: this.key
      })
      this.component.element.dispatchEvent(openingRequest)
      // The node will be made look open and loading via Sky generator.
    }
  })

  // Replace default component
  this.component = newItem

  this.render()
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
