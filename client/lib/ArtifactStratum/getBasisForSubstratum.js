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

  // TODO basis for next page

  return this.nodePlane.getBasis().scaleBy(0.2) // TODO improve position
}
