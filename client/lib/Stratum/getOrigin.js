module.exports = function () {
  // Get the origin point tensor of the stratum.
  // Useful for determining the anchor point of the stratum.
  // In future we might want the root node be the origin.
  //
  // Return
  //   a tapspace.geometry.Point
  //
  const d = this.renderSize / 2
  return this.space.at(d, d)
}
