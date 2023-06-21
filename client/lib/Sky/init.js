module.exports = function (firstPath) {
  // Initialize the Sky: begin loading the first stratum.
  //

  // TODO should this be part of loader or should we make loader here?

  const firstBasis = this.viewport.getBasisAt(this.viewport.atCenter())

  // TODO allow preset context when user arrives to a substratum.
  const firstContext = {}

  this.loader.init(firstPath, firstBasis, firstContext)
}
