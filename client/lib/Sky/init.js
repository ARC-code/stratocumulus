const Context = require('../Context')

module.exports = function (firstPath) {
  // Initialize the Sky: begin loading the first stratum.
  //

  const firstBasis = this.viewport.getBasisAt(this.viewport.atCenter())

  // TODO allow preset context when user arrives directly to a substratum.
  // TODO context: Context.fromQueryString(query)
  const eventData = { context: new Context() }

  this.loader.init(firstPath, firstBasis, eventData)
}
