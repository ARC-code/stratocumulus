module.exports = function () {
  // This method is responsible for semantic zoom features
  // and managint the spaces to allow infinite depth.
  //
  // - show/hide labels according to their size
  // - open and close strata
  //

  const spaces = this.viewport.getHyperspace().getChildren()
  const camera = this.viewport.atCamera()
  const viewCenter = this.viewport.atCenter()
  const viewWidth = this.viewport.getWidth().getRaw()

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

    const widthOnView = boundingCircle.getWidth().getNumber()

    const dz = viewWidth / dilation
    const distance3 = Math.sqrt(distancePx * distancePx + dz * dz)

    return {
      space: space,
      stratum: stratum,
      dilation: dilation,
      distance: distancePx,
      distance3: distance3,
      bounds: boundingCircle,
      width: widthOnView,
      widthRatio: widthOnView / viewWidth
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
      this.currentStratumPath = currentStratumCandidate.path
    }
  }

  console.log('current', currentStratum.path)
  // 
  // // Measure nodes on that closest stratum
  // // to see if one should be opened.
  // const nodeItems = currentStratum.nodePlane.getChildren()
  // const nodeMetrics = nodeItems.map(nodeItem => {
  //   const dilation = this.viewport.measureDilation(nodeItem)
  //   const originOnView = nodeItem.atCenter().projectTo(this.viewport, camera)
  //   const distancePx = originOnView.getDistanceTo(viewCenter).getRaw()
  //   const dz = viewWidth / dilation
  //   const distance3 = Math.sqrt(distancePx * distancePx + dz * dz)
  // })

  // Reveal or close labels of each stratum
  Object.values(this.strata).forEach(stratum => {
    stratum.revealLabels()
  })
}
