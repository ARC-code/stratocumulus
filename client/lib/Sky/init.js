module.exports = function (firstPath) {
  // Initialize the Sky: begin loading the first stratum.
  //

  const firstBasis = this.viewport.getBasisAt(this.viewport.atCenter())

  // TODO allow preset context when user arrives directly to a substratum.
  const eventData = {
    path: firstPath,
    trail: [],
    context: {}
  }

  this.loader.init(firstPath, firstBasis, eventData)
}
