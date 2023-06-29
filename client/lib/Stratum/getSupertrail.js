module.exports = function () {
  // Get the trail for the superstratum.
  // Copies trail of this and removes the last element.
  //
  // Return
  //   an array, a trail
  //
  if (this.trail.length <= 1) {
    return []
  }

  // Return shallow copy without the last element.
  return this.trail.slice(0, -1)
}
