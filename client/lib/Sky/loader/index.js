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
      if (sky.strata[parentId]) {
        const parentStratum = sky.strata[parentId]
        const facetNode = parentStratum.getNode(childId)
        if (!facetNode) {
          console.log(parentStratum.renderedNodes)
          throw new Error('Unknown facet node: ' + childId)
        }
        const childBasis = facetNode.component.getBasis()
        // TODO instead of hard-coded scaling, rely that nodes have
        // constant size and scale the stratum internally to fit the size.
        return childBasis.scaleBy(0.1, facetNode.getOrigin())
      }
      return null
    },

    backmapper: function (childId, childSpace, parentId) {
      // Dummy backmapper
      return null
    },

    tracker: function (parentId, parentSpace) {
      // Get IDs of the children of the parent component.
      const parentStratum = parentSpace.stratum
      return parentStratum.graph.nodes()
    },

    backtracker: function (childId, childSpace) {
      // Find parent id.
      // If no parent and the child is the root node, return null.
      return childSpace.stratum.superpath
    }
  })

  generator(sky, loader)
  driver(sky, loader)

  return loader
}
