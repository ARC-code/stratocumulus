module.exports = function () {
  // Get the origin point of the sky. The viewport center.
  // Useful for estimating the position of our gaze.
  //
  // Return
  //   a tapspace.geometry.Point
  //
  return this.viewport.atNorm(0.5, 0.5)
}
