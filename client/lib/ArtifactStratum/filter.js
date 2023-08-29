const config = require('../config')

module.exports = function (context) {
  // @ArtifactStratum:filter(context)
  //
  // Filter the stratum by a filtering context.
  // TODO
  //
  // Parameters:
  //   context
  //     a Context. The context can include faceting parameters but
  //     .. only filtering parameters have effect here.
  //

  // Safeguard
  if (!this.alive) {
    return
  }

  // Old context for comparison
  const oldContext = this.context
  // Pick filtering parameters from the given context.
  const newFilters = context.filter(key => {
    return config.filterParameters.includes(key)
  })
  // Strip any old filters from the old context.
  const nakedContext = oldContext.filter(key => {
    return !config.filterParameters.includes(key)
  })
  // Add new filters, if any.
  this.context = nakedContext.merge(newFilters)

  // Prevent unnecessary filtering.
  if (this.context.equals(oldContext)) {
    // Filtered already.
    return
  }

  console.log('ArtifactStratum filter')
}
