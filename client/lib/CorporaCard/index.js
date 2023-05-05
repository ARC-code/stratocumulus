const tapspace = require('tapspace')
const generateDataPlaneCardContent = require('./generateDataPlaneCardContent')
const getArtifactId = require('./getArtifactId')
require('./style.css')

const CorporaCard = function (key, attrs, space) {
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
  this.element.className = 'data-node'

  // Create an item to add to the space.
  this.component = tapspace.createItem(this.element)
  this.component.setSize(256, 256)
  // Allow interaction with content.
  this.component.setContentInput('pointer')

  // Begin fetching content for the card.
  generateDataPlaneCardContent(artifactId, this.element)

  this.space = space
  this.space.addChild(this.component)
}

module.exports = CorporaCard
const proto = CorporaCard.prototype

proto.translateTo = require('./translateTo')
proto.getOrigin = require('./getOrigin')
proto.getRadius = require('./getRadius')

// TODO make it unnecessary to implement every StratumNode method.
proto.updateCount = () => {}
