module.exports = function (subcontext) {
  // @ArtifactStratum:getBasisForSubstratum(subcontext)
  //
  // Overrides Stratum:getBasisForSubstratum
  //
  // The method returns a basis for the given subcontext.
  // The basis is useful to position substrata.
  //
  // Parameters:
  //   subcontext
  //     a Context
  //
  // Returns:
  //   a tapspace.geometry.Basis
  //

  // TODO improve position
  this.recomputeBoundingCircle()
  const origin = this.boundingCircle.atCenter()
  return this.nodePlane.getBasis().scaleBy(0.6, origin)
}
