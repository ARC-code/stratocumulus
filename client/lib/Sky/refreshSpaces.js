module.exports = function () {
  // This method is responsible for semantic zoom features
  // and managint the spaces to allow infinite depth.
  //
  // - show/hide labels according to their size
  // - open and close strata
  //

  // Measure strata relative to viewport.
  const strataMetrics = this.viewport.measureAll((component) => {
    return component.isStratum
  })

  strataMetrics.forEach((metric) => {
    const stratumSpace = metric.target
    const stratumPath = stratumSpace.stratumPath
    const stratum = this.strata[stratumPath]

    if (!stratum) {
      throw new Error('Stratum not found in Sky but still measured. Weird.')
    }
    console.log('metric for ' + stratumPath, metric)

    if (metric.areaRatio < 0.0001) {
      console.log('remove stratum', stratumPath)
    }
  })

  // Reveal or close labels of each stratum
  Object.values(this.strata).forEach(stratum => {
    stratum.revealLabels()
  })
}
