const emitter = require('component-emitter')

const Stratum = function (context) {
  // @Stratum
  //
  // Abstract class for ArtifactStratum and CategoryStratum.
  //
  // Stratum inherits Emitter
  //
  // Parameters:
  //   context
  //
}

module.exports = Stratum
const proto = Stratum.prototype
proto.isStratum = true

// Inherit
emitter(proto)

// Methods
proto.getSpace = require('./getSpace')
