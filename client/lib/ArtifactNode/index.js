require('./artifactnode.css')
const tapspace = require('tapspace')
const generateDataPlaneCardContent = require('./generateDataPlaneCardContent')
const getArtifactId = require('./getArtifactId')

const ArtifactNode = function (key, attrs) {
  // DataCard is a card-like element in space.
  //
  // Parameters:
  //   key
  //     a string, node key
  //   attrs
  //     node attributes
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
}

module.exports = ArtifactNode
const proto = ArtifactNode.prototype

// TODO make it unnecessary to implement every StratumNode method.
proto.translateTo = require('./translateTo')
proto.getOrigin = require('./getOrigin')
proto.getRadius = require('./getRadius')
proto.isFacetable = require('./isFacetable')
proto.render = require('./render')
