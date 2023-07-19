const io = require('../io')

module.exports = function (keyword) {
  // Filter the stratum by a free-form text query.
  // This will send a new stratum build job.
  //
  // Parameters:
  //   keyword
  //     a string, a search phrase containing one or more words.
  //

  // Safeguard
  if (!this.alive) {
    return
  }

  // Prevent unnecessary filtering.
  const prevKeyword = this.context.getValue('q')
  if (prevKeyword === keyword || (!prevKeyword && !keyword)) {
    // Filtered already.
    return
  }

  // Update the filtering context for further queries.
  for (const param in keyword) {
    // TODO prevent adding empty values
    this.context = this.context.remove(param).append(param, keyword[param])
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
