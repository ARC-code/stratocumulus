module.exports = function () {
  // Get node scale as a scale tensor.
  // Useful for matching scales of substratum.
  //
  // Return
  //   a tapspace.geometry.Scale
  //
  return this.component.getScale()
}
