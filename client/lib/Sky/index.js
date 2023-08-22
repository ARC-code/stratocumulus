require('./sky.css')
const emitter = require('component-emitter')
const loader = require('./loader')

const Sky = function (viewport) {
  // @Sky
  //
  // Sky manages stratum objects and their loading.
  //
  // Parameters:
  //   viewport
  //     a tapspace.components.Viewport
  //
  // Emits:
  //   navigation
  //     when there is a new current stratum.
  //

  // Current known set of stratum objects.
  // stratumPath -> Stratum
  // TODO remove or clarify overlap with the loader.spaces.
  this.strata = {}

  this.viewport = viewport

  this.loader = loader(this)
}

module.exports = Sky
const proto = Sky.prototype

// Inherit
emitter(proto)

// Methods
proto.init = require('./init')
proto.filter = require('./filter')
proto.navigateToStratum = require('./navigateToStratum')
proto.navigateToNode = require('./navigateToNode')
