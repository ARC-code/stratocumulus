const Stratum = require('../Stratum')

module.exports = function (path, context, label, bgColor) {
  // Create and start one stratum.
  //
  // Parameters:
  //   path
  //     string, identifies the stratum
  //   context
  //     object
  //   label
  //     string, label for the root node
  //   bgColor
  //     string, css color for the root node
  //
  // Return:
  //   a stratum. If a stratum with the path already exists, the existing
  //   one is returned.
  //

  // Ensure we do not create duplicate strata.
  if (this.strata[path]) {
    console.warn('Attempted to recreate existing stratum: ' + path)
    return this.strata[path]
  }

  // Build
  const stratum = new Stratum(path, context, label, bgColor)

  // Init current stratum if this is the first.
  if (!this.currentStratumPath) {
    this.currentStratumPath = path
  }

  // Keep track of what strata we have built.
  this.strata[path] = stratum
  this.strataTrail.push(stratum.path)

  return stratum
}
