module.exports = function () {
  // Get stratum trail for a substratum.
  // Appends the this path to this trail.
  //
  // Return
  //   an array, the trail
  //
  return this.trail.concat([this.path])
}
