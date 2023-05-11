module.exports = function () {
  // This method is responsible for semantic zoom features
  // and managing the spaces to allow infinite depth.
  //
  // - show/hide labels according to their size
  // - open and close strata
  //

  // Shortcut if space still empty.
  if (!this.currentStratumPath) {
    return
  }

  // Find possible new current stratum
  const currentStratum = this.findCurrentStratum()
  // Update current stratum pointer.
  // TODO maybe store navigation somewhere else because
  // TODO it affects also breadcrumbs and paths.
  if (this.currentStratumPath !== currentStratum.path) {
    const previous = this.currentStratumPath
    this.currentStratumPath = currentStratum.path
    // Inform future navigation store that current path is changed.
    this.emit('pathchanged', {
      previousStratumPath: previous,
      currentStratumPath: currentStratum.path
    })
  }

  console.log('current', currentStratum.path)

  // On the current stratum, try to find a node that could be
  // large and central enough to be open.
  const stratumSpace = currentStratum.space
  const camera = this.viewport.atCamera()
  const centerOnStratum = this.getOrigin().projectTo(stratumSpace, camera)
  const maxDistance = this.viewport.getBoundingBox().getDiagonal().scaleBy(0.2)
  const maybeNodeKey = currentStratum.findNodeNear(centerOnStratum, maxDistance)
  if (maybeNodeKey) {
    const candidateKey = maybeNodeKey
    const candidateNode = currentStratum.getNode(candidateKey)
    if (candidateNode.isFacetable() && !candidateNode.isFaceted()) {
      const metric = this.viewport.measureOne(candidateNode.component)
      console.log('candidate label', candidateNode.label)
      console.log('candidate areaRatio', metric.areaRatio)
      if (metric.areaRatio > 0.05) {
        currentStratum.openNode(candidateKey)
      }
    }
  }

  // Reveal or close labels of each stratum
  Object.values(this.strata).forEach(stratum => {
    stratum.revealLabels()
  })
}
