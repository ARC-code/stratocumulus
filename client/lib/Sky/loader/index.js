const tapspace = require('tapspace')
const driver = require('./driver')
const generator = require('./generator')
const Context = require('../../Context')

module.exports = function (sky) {
  // Use tapspace TreeLoader for loading and unloading of fractal spaces.
  //
  // Return
  //   a TreeLoader
  //

  const loader = new tapspace.loaders.TreeLoader({
    viewport: sky.viewport,

    mapper: function (parentPath, parentSpace, childPath) {
      // Position the child relative to the parent.
      // In other words, find a basis for the child.
      // If there is no position for the child, null.
      const parentStratum = parentSpace.stratum
      const subcontext = Context.fromFacetPath(childPath)
      return parentStratum.getBasisForSubstratum(subcontext)
    },

    backmapper: function (childPath, childSpace, parentPath) {
      // Dummy backmapper
      return null
    },

    tracker: function (parentPath, parentSpace) {
      // Get IDs of the children of the parent component.
      const ctxs = parentSpace.stratum.getEverySubcontext()
      return ctxs.map(ctx => ctx.toFacetPath())
    },

    backtracker: function (childPath, childSpace) {
      // Find parent id.
      // If no parent and the child is the root node, return null.
      const superctx = childSpace.stratum.getSupercontext()
      if (superctx) {
        return superctx.toFacetPath()
      }
      return null
    }
  })

  generator(sky, loader)
  driver(sky, loader)

  return loader
}
