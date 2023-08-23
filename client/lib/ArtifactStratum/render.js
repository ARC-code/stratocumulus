const ArtifactNode = require('../ArtifactNode')

module.exports = function () {
  // @ArtifactStratum:render()
  //
  // Render artifacts. If elements already exist, update.
  // This method is idempotent, thus you can call this method multiple times
  // without unexpected side effects.
  //
  const nodePlaneOrigin = this.nodePlane.at(0, 0)

  this.artifactIds.forEach((key, i) => {
    let artifactNode = this.renderedNodes[key]

    if (artifactNode) {
      // TODO refresh
    } else {
      // Node does not exist. Create.
      artifactNode = new ArtifactNode(key)
      this.renderedNodes[key] = artifactNode

      // Place to DOM although artifact frame is currently empty.
      this.nodePlane.addChild(artifactNode.component)

      // NOTE no need to call artifactNode.render() because
      // called within ArtifactNode
    }

    // Derive scale relative to the stratum basis.
    artifactNode.setScale(0.4)
    // Update position according to order.
    const nPoint = nodePlaneOrigin.offset(i * 100, 0) // TODO spiral
    artifactNode.translateTo(nPoint)
  })

  // Re-compute bounding circle at each render.
  this.recomputeBoundingCircle()
}
