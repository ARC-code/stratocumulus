const io = require('../../io')

module.exports = function (stratum) {
  // Destroy the stratum.
  //
  // Parameters:
  //   stratum
  //     a stratum object
  //

  // Stop listening further stream events.
  io.stream.off(stratum.path)

  // Mark as removed
  stratum.alive = false
}
