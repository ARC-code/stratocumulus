require('./style.css')
const StratumNode = require('../StratumNode')
const io = require('../io')
const tapspace = require('tapspace')
const config = require('../config')
const ARTIFACT_SIZE = config.rendering.artifactNodeSize

const ArtifactNode = function (key) {
  // @ArtifactNode
  //
  // ArtifactNode is a card-like element in space.
  // ArtifactNode implements interface similar to CategoryNode,
  // so that the caller does not need to know which is which.
  //
  // Parameters:
  //   key
  //     a string, node key
  //

  // Inherit
  StratumNode.call(this)

  const artifactId = key

  this.element = document.createElement('div')
  this.element.className = 'artifact-card'

  // Create an item to add to the space.
  this.component = tapspace.createItem(this.element)
  this.component.setSize(ARTIFACT_SIZE, ARTIFACT_SIZE)
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

// Inherit
Object.assign(proto, StratumNode.prototype)

// TODO make it unnecessary to implement every CategoryNode method.
proto.render = require('./render')
