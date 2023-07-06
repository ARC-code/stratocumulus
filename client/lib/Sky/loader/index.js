const tapspace = require('tapspace')
const driver = require('./driver')
const generator = require('./generator')

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
      const facetNode = parentStratum.getFacetNode(childPath)
      if (!facetNode) {
        console.warn('Unknown or non-existing facet node: ' + childPath)
        return null
      }
      const childBasis = facetNode.component.getBasis()
      // Nodes have constant rendering size that is 10th of stratum size.
      return childBasis.scaleBy(0.1, facetNode.getOrigin())
    },

    backmapper: function (childPath, childSpace, parentPath) {
      // Dummy backmapper
      return null
    },

    tracker: function (parentPath, parentSpace) {
      // Get IDs of the children of the parent component.
      return parentSpace.stratum.getSubpaths()
    },

    backtracker: function (childPath, childSpace) {
      // Find parent id.
      // If no parent and the child is the root node, return null.
      return childSpace.stratum.getSuperpath()
    }
  })

  generator(sky, loader)
  driver(sky, loader)

  return loader
}
