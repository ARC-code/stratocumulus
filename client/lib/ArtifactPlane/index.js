require('./style.css')
const emitter = require('component-emitter')

const ArtifactPlane = function (context) {
  // @ArtifactPlane
  //
  // A document collection laid on a plane.
  //
  // ArtifactPlane inherits Emitter.
  // ArtifactPlane and Stratum should expose the same interface for Sky.
  //
  // Parameters:
  //   context
  //     a Context. The context gives identity to the artifact plane and
  //     .. defines the faceting and filtering of its content.
  //
  // ArtifactPlane emits:
  //   first
  //     when the first node has been loaded and rendered.
  //   final
  //     when all nodes of the stratum has been loaded and rendered.
  //   substratumrequest
  //     when the stratum would like one of its nodes to be opened as
  //     a new stratum.
  //
}

module.exports = ArtifactPlane
const proto = ArtifactPlane.prototype
proto.isArtifactPlane = true

// Inherit
emitter(proto)

// Methods
proto.load = require('./load')
proto.remove = require('./remove')
proto.render = require('./render')
