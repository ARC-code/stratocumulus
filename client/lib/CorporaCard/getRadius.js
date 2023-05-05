module.exports = function () {
  // Get node radius as a distance tensor.
  // Useful for trimming edges between nodes.
  //
  // Return
  //   a tapspace.geometry.Distance
  //
  const width = this.component.getWidth()
  return width.scaleBy(0.5)
}
