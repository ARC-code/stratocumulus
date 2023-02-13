const tapspace = require('tapspace')

module.exports = function (id) {
  // Create a planar container for a single stratum.
  //
  // Parameters:
  //   id
  //     string, an ID for the network div.
  //     Must contain only characters that are valid for HTML ID attributes.
  //
  // Return
  //   a tapspace.components.Plane
  //

  // Space plane for content. Adds the plane to the space.
  const networkPlane = tapspace.createPlane()

  // Set element attributes so we can refer to the element.
  const networkDiv = networkPlane.getElement()
  networkDiv.id = id
  networkDiv.classList.add('network')

  // Create subplanes for nodes and edges
  const nodePlane = tapspace.createPlane()
  nodePlane.addClass('network-nodes')
  const edgePlane = tapspace.createPlane()
  edgePlane.addClass('network-edges')

  // Add edge group first so they will be drawn first.
  networkPlane.addChild(edgePlane)
  networkPlane.addChild(nodePlane)

  // A sketchy way to refer to the groups later. TODO improve.
  networkPlane.edgeGroup = edgePlane
  networkPlane.nodeGroup = nodePlane

  return networkPlane
}
