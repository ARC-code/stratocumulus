module.exports = (nodePositions, origin, angle) => {
  // Compute rotated positions.
  //
  // Parameters:
  //   nodePositions
  //     a map: path -> {x,y}
  //   origin
  //     a point: {x,y}. Rotate around this point.
  //   angle
  //     a number in radians
  //
  // Return
  //   a map: path -> {x,y}. The rotated positions as a new object.
  //

  // Rotation matrix; linear transformation.
  // |co, -si|
  // |si,  co|
  const co = Math.cos(angle)
  const si = Math.sin(angle)
  const ox = origin.x
  const oy = origin.y

  // Construct the rotated positions to a new map.
  return Object.keys(nodePositions).reduce((accumulator, nodeKey) => {
    const np = nodePositions[nodeKey]
    // Apply rotation around origin
    accumulator[nodeKey] = {
      x: (np.x - ox) * co - (np.y - oy) * si + ox,
      y: (np.x - ox) * si + (np.y - oy) * co + oy
    }
    return accumulator
  }, {})
}
