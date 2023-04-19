const io = require('../io')
const stratumModel = require('./model')
const stratumView = require('./view')

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
  this.context.q = keyword

  const beginBuildJob = () => {
    // Send a new build job with the updated context.

    // Safeguard
    if (!this.alive) {
      return
    }
    // Invalidate nodes in order to remove extra.
    stratumModel.invalidateAll(this.graph)
    stratumView.refreshCounts(this.space, this.graph)
    // Mark that we are loading again.
    this.loading = true
    io.stream.sendStratumBuildJob(this.path, this.context)
  }

  if (this.loading) {
    // Still waiting for the previous build job to finish.
    this.once('final', beginBuildJob)
  } else {
    // Not currently loading; Free to send a new build job.
    beginBuildJob()
  }
}
