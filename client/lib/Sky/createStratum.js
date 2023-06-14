const Stratum = require('../Stratum')

module.exports = function (path, superpath, context, label) {
  // Create and start one stratum.
  //
  // Parameters:
  //   path
  //     string, identifies the stratum
  //   superpath
  //     string, the superstratum path
  //   context
  //     object
  //   label
  //     string, label for the root node
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
  const stratum = new Stratum(path, superpath, context, label)

  // Keep track of what strata we have built.
  this.strata[path] = stratum

  return stratum
}
