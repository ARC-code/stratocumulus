const tapspace = require('tapspace')

module.exports = function (space, id) {
  // Create container for the stratum
  //
  // Parameters:
  //   space
  //     a Tapspace space into which to add the network div.
  //   id
  //     string, a valid html id for the network div.
  //
  // Return
  //   a HTMLElement with affine perk
  //

  // Space plane for content. Adds the plane to the space.
  const networkPlane = tapspace.createBasis()

  // Set element attributes so we can refer to the element.
  const networkDiv = networkPlane.getElement()
  networkDiv.id = id
  networkDiv.classList.add('network')

  // Create groups for nodes and edges
  const nodeGroup = tapspace.createBasis()
  nodeGroup.addClass('network-nodes')
  const edgeGroup = tapspace.createBasis()
  edgeGroup.addClass('network-edges')

  // Add edge group first so they will be drawn first.
  networkPlane.addChild(edgeGroup)
  networkPlane.addChild(nodeGroup)

  // A sketchy way to refer to the groups later. TODO improve.
  networkPlane.edgeGroup = edgeGroup
  networkPlane.nodeGroup = nodeGroup

  space.addChild(networkPlane)
  // networkDiv.scrollIntoView() // TODO is necessary?

  return networkDiv
}
