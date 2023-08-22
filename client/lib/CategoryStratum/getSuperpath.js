module.exports = function () {
  // Get the path of the superstratum.
  // Null if the stratum is root.
  //
  // Return
  //   a string, a StratumPath. Null if this is the root stratum.
  //

  if (this.path === '/') {
    return null
  }

  const superctx = this.getSupercontext()

  // TODO do we a method for this really? Could caller use context directly?
  return superctx.toFacetPath()
}
