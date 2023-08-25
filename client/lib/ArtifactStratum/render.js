const ArtifactNode = require('../ArtifactNode')
const STEPS = 9
const RADIUS = 1280 // TODO use config
const ANGLE_STEP = 2 * Math.PI / STEPS

module.exports = function () {
  // @ArtifactStratum:render()
  //
  // Render artifacts. If elements already exist, update.
  // This method is idempotent, thus you can call this method multiple times
  // without unexpected side effects.
  //
  const nodePlaneOrigin = this.nodePlane.at(RADIUS, RADIUS)

  this.artifactIds.forEach((key, i, ids) => {
    let artifactNode = this.renderedNodes[key]

    if (artifactNode) {
      // TODO Refresh
      // artifactNode.update(data?)
    } else {
      // Node does not exist. Create. Artifact data is populated later.
      artifactNode = new ArtifactNode(key, {})
      this.renderedNodes[key] = artifactNode
      // Place to DOM although artifact frame is currently empty.
      this.nodePlane.addChild(artifactNode.component)
      // Last one opens the next page. TODO do something more flexible
      if (i === ids.length - 1) {
        artifactNode.isLast = true
      } else {
        artifactNode.isLast = false
      }
    }

    // Derive scale relative to the stratum basis.
    artifactNode.setScale(1.6 / (1 + i / STEPS))
    // Update position according to order.
    const distance = RADIUS / (1 + i / STEPS)
    const direction = ANGLE_STEP * i
    const nPoint = nodePlaneOrigin.polarOffset(distance, direction)
    artifactNode.translateTo(nPoint)
  })

  // Re-compute bounding circle at each render.
  this.recomputeBoundingCircle()
  // Scale so that cards just fit inside the rendering area.
  this.scaleNodesToFit()
}
