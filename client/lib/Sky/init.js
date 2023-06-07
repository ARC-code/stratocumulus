module.exports = function (firstPath) {
  // Initialize the Sky: begin loading the first stratum.
  //

  // TODO should this be part of loader or should we make loader here?

  const firstBasis = this.viewport.getBasisAt(this.viewport.atCenter())
  // TODO pass context? label, color, filtering context...
  this.treeLoader.init(firstPath, firstBasis)
}
