const io = require('../io')

module.exports = function () {
  // Begin constructing stratum from the back-end.
  // This makes the stratum alive.
  //

  io.corpora.fetchArtifactPage(this.context, (err, page) => {
    if (err) {
      console.error(err)
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
