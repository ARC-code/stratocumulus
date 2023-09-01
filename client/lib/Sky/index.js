require('./sky.css')
const emitter = require('component-emitter')
const tapspace = require('tapspace')
const driver = require('./driver')
const generator = require('./generator')
const Context = require('../Context')

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
  //   loading
  //     when beginning to load stratum
  //   first
  //     when first stratum has some content.
  //   navigation
  //     when there is a new current stratum.
  //

  // Current known set of stratum objects.
  // stratumPath -> Stratum
  // TODO remove or clarify overlap with the loader.spaces.
  this.strata = {}

  this.viewport = viewport

  // Track last known current stratum.
  // Useful to detect when current stratum changes.
  // Useful to limit strata during filtering.
  this.currentStratumPath = null

  // Use tapspace TreeLoader for loading and unloading of fractal spaces.
  this.loader = new tapspace.loaders.TreeLoader({
    viewport: this.viewport,

    mapper: (parentPath, parentSpace, childPath) => {
      // Position the child relative to the parent.
      // In other words, find a basis for the child.
      // If there is no position for the child, null.
      const parentStratum = parentSpace.stratum
      const subcontext = Context.fromFacetPath(childPath)
      return parentStratum.getBasisForSubstratum(subcontext)
    },

    backmapper: (childPath, childSpace, parentPath) => {
      // Dummy backmapper
      return null
    },

    tracker: (parentPath, parentSpace) => {
      // Get IDs of the children of the parent component.
      const ctxs = parentSpace.stratum.getEverySubcontext()
      return ctxs.map(ctx => ctx.toFacetPath())
    },

    backtracker: (childPath, childSpace) => {
      // Find parent id.
      // If no parent and the child is the root node, return null.
      const superctx = childSpace.stratum.getSupercontext()
      if (superctx) {
        return superctx.toFacetPath()
      }
      return null
    }
  })

  // Setup
  generator(this, this.loader)
  driver(this, this.loader)
}

module.exports = Sky
const proto = Sky.prototype

// Inherit
emitter(proto)

// Methods
proto.filter = require('./filter')
proto.navigateToStratum = require('./navigateToStratum')
proto.navigateToNode = require('./navigateToNode')
