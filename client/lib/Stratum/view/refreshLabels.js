module.exports = function (stratum, viewport) {
  // Show/hide labels depending on visible node size.
  //
  // Parameters:
  //   stratum
  //     a stratum object
  //   viewport
  //     a tapspace viewport, required for finding node size relative to it.
  //
  const stratumSpace = stratum.space
  const nodes = stratumSpace.nodeGroup.getChildren() // HACKY
  const viewportWidth = viewport.getWidth().getNumber()

  nodes.forEach((node) => {
    // const trip = viewport.atCamera().getVectorTo(node.atCenter())
    // const tripDeltaZ = trip.transitRaw(viewport).z

    // Determine node size on viewport.
    const camera = viewport.atCamera()
    const nodeWidthTensor = node.getWidth().projectTo(viewport, camera)
    const nodeWidth = nodeWidthTensor.getNumber() // px
    const indicator = nodeWidth / viewportWidth

    // TODO Replace with true, projected node size on viewport in pixels,
    // TODO so that the label threshold is based on font size.
    // const indicator = tripDeltaZ - width * width

    // Show if large enough, ensure hidden otherwise.
    const label = node.getElement().querySelector('.label')
    // Check that label exists.
    if (label) {
      if (indicator > 0.01 && indicator < 0.7) {
        label.style.display = 'inline'
        node.setSolidity(true)
      } else {
        label.style.display = 'none'
        // Allow travel through
        node.setSolidity(false)
      }
    }
  })
}
