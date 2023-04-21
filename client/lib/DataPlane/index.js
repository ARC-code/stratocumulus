const emitter = require('component-emitter')

const DataPlane = function (path, context) {
  // A document collection laid on a plane.
  //
  // DataPlane inherits Emitter
  //
  // Parameters:
  //   path
  //     string, the stratum id
  //   context
  //     object, tells where the user came from.
  //
  // DataPlane emits:
  //   first
  //     when the first node has been loaded and rendered.
  //   final
  //     when all subgraphs of the cards have been loaded and rendered.
  //

  // TODO follow stratum interface?
  // TODO Is DataPlane just a stratum but with alternative view?
}

module.exports = DataPlane
const proto = DataPlane.prototype

// Inherit
emitter(proto)

// Methods
// TODO
