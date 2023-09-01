const io = require('../io')

module.exports = function (context) {
  // @CategoryStratum:filter(context)
  //
  // Filter the stratum by a filtering context.
  // This will send a new stratum build job.
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
  const newFilters = context.getFilteringContext()
  // Strip any old filters from the old context.
  const nakedContext = oldContext.getFacetingContext()
  // Add new filters, if any.
  this.context = nakedContext.merge(newFilters)

  // Prevent unnecessary filtering.
  if (this.context.equals(oldContext)) {
    // Filtered already.
    return
  }

  const beginBuildJob = () => {
    // Send a new build job with the updated context.

    // Safeguard for removed stratum, e.g. when previous final has taken
    // long time and the user has moved far away.
    if (!this.alive) {
      return
    }
    // Safeguard duplicate final listeners, e.g. when user immediately tries
    // another keyword.
    if (this.loading) {
      return
    }

    // Hide edges
    this.space.addClass('stratum-loading')
    // Mark that we are loading again.
    this.loading = true
    // Begin loading filtered.
    io.graphStore.fetch(this.context)
    this.once('final', () => {
      // Remove all the stale.
      this.prune()
    })
  }

  if (this.loading) {
    // Still waiting for the previous build job to finish.
    this.once('final', beginBuildJob)
  } else {
    // Not currently loading; Free to send a new build job.
    beginBuildJob()
  }
}
