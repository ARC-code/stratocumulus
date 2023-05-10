module.exports = function () {
  // Find a stratum that the user is currently looking at.
  // This does not modify the current stratum path or navigation history.
  //
  // Return
  //   a string, stratumPath of the stratum in which the user probably
  //   .. perceives to be located.
  //
  const spaces = this.viewport.getHyperspace().getChildren()
  const camera = this.viewport.atCamera()
  const viewCenter = this.viewport.atCenter()
  const viewWidth = this.viewport.getWidth().getRaw()

  // Current algorithm:
  // - measure pseudoperspective distance to each stratum center
  // - pick the closest one.

  // TODO try simpler approach:
  // - find all strata in which the viewport center is currently
  // - pick the smallest of these strata so that is still over a threshold.

  const spaceMetrics = spaces.map((space) => {
    const dilation = this.viewport.measureDilation(space)
    const stratumPath = space.stratumPath
    const stratum = this.strata[stratumPath]

    if (!stratum) {
      throw new Error('Stratum not found in Sky but still measured. Weird.')
    }

    const boundingCircle = stratum
      .getBoundingCircle()
      .changeBasis(this.viewport)

    const originOnView = stratum.getOrigin().projectTo(this.viewport, camera)
    const distancePx = originOnView.getDistanceTo(viewCenter).getRaw()

    const dz = viewWidth / dilation
    const distance3 = Math.sqrt(distancePx * distancePx + dz * dz)

    return {
      space: space,
      stratum: stratum,
      dilation: dilation,
      distance: distancePx,
      distance3: distance3,
      bounds: boundingCircle
    }
  })

  // Try to find new current stratum. If none found, keep the current.
  // If one found and it is not the current, change to it.
  const currentMetric = spaceMetrics.reduce((acc, metric) => {
    if (metric.distance3 < acc.minDistance3) {
      // This might be a new current stratum.
      return {
        minDistance3: metric.distance3,
        metric: metric
      }
    }
    // else
    return acc
  }, {
    minDistance3: Infinity,
    metric: null
  })

  let currentStratum = this.strata[this.currentStratumPath]

  if (currentMetric.metric) {
    const currentStratumCandidate = currentMetric.metric.stratum
    if (this.currentStratumPath !== currentStratumCandidate.path) {
      // We have new current stratum.
      currentStratum = this.strata[currentStratumCandidate.path]
    }
  }

  return currentStratum
}
