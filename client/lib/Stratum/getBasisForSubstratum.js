module.exports = function (subcontext) {
  // @Stratum:getBasisForSubstratum(subcontext)
  //
  // A placeholder that ensures subclasses implement the method.
  //
  // The method should return a basis for the given subcontext.
  // Subclasses may invent their own substratum positioning logic.
  // Therefore this method is useful to abstract out the computation of
  // the basis from the Sky driver.
  //
  // Parameters:
  //   subcontext
  //     a Context
  //
  // Returns:
  //   a tapspace.geometry.Basis
  //
  throw new Error('Subclasses must implement the getBasisForSubstratum method.')
}
