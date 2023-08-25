const config = require('../config')
const RENDER_SIZE = config.rendering.stratumSize

module.exports = function () {
  // @Stratum:scaleToFit()
  //
  // Transforms the node plane so that it fits the rendering area.
  //
  const circleCenter = this.boundingCircle.atCenter()
  const circleRadius = this.boundingCircle.getRadius()
  const circleTop = circleCenter.polarOffset(circleRadius, -Math.PI / 2)
  const circleBottom = circleCenter.polarOffset(circleRadius, Math.PI / 2)
  const targetTop = this.space.at(RENDER_SIZE / 2, 0)
  const targetBottom = this.space.at(RENDER_SIZE / 2, 0.8 * RENDER_SIZE)
  this.nodePlane.match({
    source: [circleTop, circleBottom],
    target: [targetTop, targetBottom],
    estimator: 'TS'
  })
}
