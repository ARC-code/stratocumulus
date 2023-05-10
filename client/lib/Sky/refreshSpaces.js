module.exports = function () {
  // This method is responsible for semantic zoom features
  // and managing the spaces to allow infinite depth.
  //
  // - show/hide labels according to their size
  // - open and close strata
  //

  const stratumPath = this.findCurrentStratum()

  if (this.currentStratumPath !== stratumPath) {
    const previous = this.currentStratumPath
    this.currentStratumPath = stratumPath

    this.emit('pathchanged', {
      previousStratumPath: previous,
      currentStratumPath: stratumPath
    })
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
