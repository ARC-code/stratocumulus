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
  // The current stratumPath.
  this.currentStratumPath = null

  // Setup space for strata.
  // TODO use tapspace FractalLoader to handle planes.
  this.viewport = viewport

  this.treeLoader = loader(this)
}

module.exports = Sky
const proto = Sky.prototype

// Inherit
emitter(proto)

// Methods
proto.init = require('./init')
proto.createStratum = require('./createStratum')
proto.emphasizeDecades = require('./emphasizeDecades')
proto.filterByKeyword = require('./filterByKeyword')
proto.findCurrentStratum = require('./findCurrentStratum')
proto.getOrigin = require('./getOrigin')
proto.getSubcontext = require('./getSubcontext')
proto.getSubstratumPaths = require('./getSubstratumPaths')
proto.getSupercontext = require('./getSupercontext')
proto.getSuperstratumPath = require('./getSuperstratumPath')
proto.revealLabels = require('./revealLabels')
proto.removeStratum = require('./removeStratum')
