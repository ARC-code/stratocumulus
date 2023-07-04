const io = require('../io')
const stratumModel = require('./model')

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

  // Update the filtering context for further queries.
  this.context.remove('q')
  this.context.append('q', keyword)

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

    // Invalidate nodes in order to remove extra.
    stratumModel.staleAll(this.graph)
    stratumModel.freezeLayout(this.graph)
    this.refreshLayout()
    // Mark that we are loading again.
    this.loading = true
    io.stream.sendStratumBuildJob(this.path, this.context)
    // Unfreeze and remove all the stale.
    this.once('final', () => {
      stratumModel.pruneStale(this.graph)
      stratumModel.unfreezeLayout(this.graph)
      this.prune()
      this.refreshLayout()
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
