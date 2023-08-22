const RENDER_SIZE = require('../config').sizing.stratumSize

module.exports = function () {
  // @Stratum:getOrigin()
  //
  // Get the origin point tensor of the stratum.
  // Useful for determining the anchor point of the stratum.
  // In future we might want the root node be the origin.
  //
  // Return
  //   a tapspace.geometry.Point
  //
  const d = RENDER_SIZE / 2
  return this.space.at(d, d)
}
