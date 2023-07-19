module.exports = function () {
  // Get card center point as a point tensor.
  // Useful for getting the node position in a consistent manner.
  //
  // Return
  //   a tapspace.geometry.Point
  //
  return this.component.atCenter()
}
