module.exports = function () {
  // Get the origin point tensor of the stratum.
  // Useful for determining the anchor point of the stratum.
  // In future we might want the root node be the origin.
  //
  // Return
  //   a tapspace.geometry.Point
  //
  return this.space.at(0, 0)
}
