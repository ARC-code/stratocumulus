module.exports = function () {
  // Get the path of the superstratum.
  // Basically returns the last item of the trail. Null if trail is empty.
  //
  // Return
  //   a string, a StratumPath. Null if this is the root stratum.
  //
  const len = this.trail.length

  if (len < 1) {
    return null
  }

  // The last element.
  return this.trail[len - 1]
}
