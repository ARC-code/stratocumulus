const emitter = require('component-emitter')

const ArtifactPlane = function (path, context) {
  // A document collection laid on a plane.
  //
  // ArtifactPlane inherits Emitter
  //
  // Parameters:
  //   path
  //     string, the stratum id
  //   context
  //     object, tells where the user came from.
  //
  // ArtifactPlane emits:
  //   first
  //     when the first node has been loaded and rendered.
  //   final
  //     when all subgraphs of the cards have been loaded and rendered.
  //

  // TODO follow stratum interface?
  // TODO Is ArtifactPlane just a stratum but with alternative view?
}

module.exports = ArtifactPlane
const proto = ArtifactPlane.prototype

// Inherit
emitter(proto)

// Methods
// TODO
