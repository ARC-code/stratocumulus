const io = require('../io')
const config = require('../config')

module.exports = function (context) {
  // @Stratum:filter(context)
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
    // Invalidate nodes in order to remove extra.
    this.refreshNodeSizes()
    // Mark that we are loading again.
    this.loading = true
    // Begin loading filtered.
    io.graphStore.fetch(this.context)
    // Remove all the stale.
    this.once('final', () => {
      this.space.removeClass('stratum-loading')
      this.prune()
      this.refreshNodeSizes()
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
