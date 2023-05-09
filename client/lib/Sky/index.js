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
  // Current navigational path.
  // array of stratumId
  this.strataTrail = []
  // The index of the current stratum.
  // TODO how to benefit from currently focused stratum?
  this.currentStratum = 0

  // Setup space for strata.
  // TODO use tapspace FractalLoader to handle planes.
  this.viewport = viewport
}

module.exports = Sky
const proto = Sky.prototype

// Methods
proto.createStratum = require('./createStratum')
proto.emphasizeDecades = require('./emphasizeDecades')
proto.filterByKeyword = require('./filterByKeyword')
proto.refreshSpaces = require('./refreshSpaces')
proto.removeStratum = require('./removeStratum')
