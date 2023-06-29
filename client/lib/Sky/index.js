const emitter = require('component-emitter')
const loader = require('./loader')
// Import styles
require('./stratum.css')

const Sky = function (viewport) {
  // Sky, Atmosphere, StratumManager...
  //
  // Parameters:
  //   viewport
  //     a tapspace.components.Viewport
  //

  // Current known set of stratum objects.
  // stratumPath -> Stratum
  this.strata = {}

  // Setup space for strata.
  // TODO use tapspace FractalLoader to handle planes.
  this.viewport = viewport

  this.loader = loader(this)
}

module.exports = Sky
const proto = Sky.prototype

// Inherit
emitter(proto)

// Methods
proto.init = require('./init')
proto.emphasizeDecades = require('./emphasizeDecades')
proto.filterByKeyword = require('./filterByKeyword')
proto.getOrigin = require('./getOrigin')
proto.getSubcontext = require('./getSubcontext')
proto.getSupercontext = require('./getSupercontext')
proto.revealLabels = require('./revealLabels')
