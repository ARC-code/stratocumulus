const io = require('../io')

module.exports = function () {
  // @ArtifactStratum:load()
  //
  // Begin constructing stratum from the back-end.
  // This makes the stratum alive.
  //

  if (this.alive) {
    // Already listening.
    console.warn('Duplicate load() call for ' + this.path)
    return
  }
  if (this.loading) {
    // Already loading.
    console.warn('Already loading ' + this.path)
    return
  }

  // Mark that it has or will have content.
  this.alive = true
  this.loading = true

  io.corpora.fetchArtifactPage(this.context, (err, page) => {
    // Register that loading is now finished.
    this.loading = false

    // Handle error
    if (err) {
      console.error(err)
      return
    }

    if (!this.alive) {
      // Stratum was removed during fetch.
      return
    }

    this.artifactIds = page.artifactIds

    // TODO render necessary here?
    this.render()

    // TODO necessary to emit?
    this.emit('first')
    this.emit('final')
  })
}
