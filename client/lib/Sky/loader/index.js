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

    mapper: function (parentId, parentSpace, childId) {
      // Position the child relative to the parent.
      // In other words, find a basis for the child.
      // If there is no position for the child, null.
      const parentStratum = parentSpace.stratum
      const facetNode = parentStratum.getNode(childId)
      if (!facetNode) {
        console.warn('Unknown or non-existing facet node: ' + childId)
        return null
      }
      const childBasis = facetNode.component.getBasis()
      // Nodes have constant rendering size that is 10th of stratum size.
      return childBasis.scaleBy(0.1, facetNode.getOrigin())
    },

    backmapper: function (childId, childSpace, parentId) {
      // Dummy backmapper
      return null
    },

    tracker: function (parentId, parentSpace) {
      // Get IDs of the children of the parent component.
      return parentSpace.stratum.getSubpaths()
    },

    backtracker: function (childId, childSpace) {
      // Find parent id.
      // If no parent and the child is the root node, return null.
      return childSpace.stratum.getSuperpath()
    }
  })

  generator(sky, loader)
  driver(sky, loader)

  return loader
}
