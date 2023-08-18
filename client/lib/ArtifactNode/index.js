require('./artifactnode.css')
const io = require('../io')
const tapspace = require('tapspace')
const getArtifactId = require('./getArtifactId')

const ArtifactNode = function (key, attrs) {
  // @ArtifactNode
  //
  // ArtifactNode is a card-like element in space.
  // ArtifactNode implements interface similar to StratumNode,
  // so that the caller does not need to know which is which.
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

  // Fetch the content for the card.
  this.artifact = null
  io.corpora.fetchArtifact(artifactId, (err, art) => {
    if (err) {
      // TODO alert user?
      console.error(err)
      return
    }

    this.artifact = art

    // TODO prevent duplicate render calls because Stratum calls render() too.
    this.render()
  })
}

module.exports = ArtifactNode
const proto = ArtifactNode.prototype
proto.isArtifactNode = true

// TODO make it unnecessary to implement every StratumNode method.
proto.translateTo = require('./translateTo')
proto.getOrigin = require('./getOrigin')
proto.getRadius = require('./getRadius')
proto.isFacetable = require('./isFacetable')
proto.remove = require('./remove')
proto.render = require('./render')
