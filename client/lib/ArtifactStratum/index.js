require('./style.css')
const emitter = require('component-emitter')

const ArtifactStratum = function (context) {
  // @ArtifactStratum
  //
  // A document collection laid on a plane.
  //
  // ArtifactStratum inherits Stratum
  // All Stratum classes should expose the same interface for Sky.
  //
  // Parameters:
  //   context
  //     a Context. The context gives identity to the artifact plane and
  //     .. defines the faceting and filtering of its content.
  //
  // ArtifactStratum emits:
  //   first
  //     when the first node has been loaded and rendered.
  //   final
  //     when all nodes of the stratum has been loaded and rendered.
  //   substratumrequest
  //     when the stratum would like one of its nodes to be opened as
  //     a new stratum.
  //
}

module.exports = ArtifactStratum
const proto = ArtifactStratum.prototype
proto.isArtifactStratum = true

// Inherit
emitter(proto)

// Methods
proto.load = require('./load')
proto.remove = require('./remove')
proto.render = require('./render')
