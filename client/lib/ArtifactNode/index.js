const tapspace = require('tapspace')
const generateDataPlaneCardContent = require('./generateDataPlaneCardContent')
const getArtifactId = require('./getArtifactId')
require('./style.css')

const ArtifactNode = function (key, attrs, space) {
  // DataCard is a card-like element in space.
  //
  // Parameters:
  //   key
  //     a string, node key
  //   attrs
  //     node attributes
  //   space
  //     a parent space
  //

  const artifactId = getArtifactId(attrs)

  this.element = document.createElement('div')
  this.element.className = 'dataplane-card'

  // Create an item to add to the space.
  this.component = tapspace.createItem(this.element)
  this.component.setSize(300, 500)
  // Gravity at card center
  this.component.setAnchor(this.component.atCenter())

  // Allow interaction with content.
  this.component.setContentInput('pointer')

  // Begin fetching content for the card.
  generateDataPlaneCardContent(artifactId, this.element)

  this.space = space
  this.space.addChild(this.component)

  // Make quite small
  this.component.scaleBy(0.4, this.component.atCenter())
}

module.exports = ArtifactNode
const proto = ArtifactNode.prototype

proto.translateTo = require('./translateTo')
proto.getOrigin = require('./getOrigin')
proto.getRadius = require('./getRadius')
proto.isFacetable = require('./isFacetable')

// TODO make it unnecessary to implement every StratumNode method.
proto.updateCount = () => {}
