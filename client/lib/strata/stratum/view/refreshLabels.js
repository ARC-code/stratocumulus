module.exports = function (stratum, viewport) {
  // Show/hide labels depending on visible node size.
  //
  // Parameters:
  //   stratum
  //     a stratum object
  //   viewport
  //     a tapspace viewport, required for finding node size relative to it.
  //
  const stratumPlane = stratum.plane
  const nodes = stratumPlane.nodeGroup.getChildren() // HACKY

  nodes.forEach((node) => {
    const trip = viewport.atCamera().getVectorTo(node.atCenter())
    const tripDeltaZ = trip.transitRaw(viewport).z

    // Determine node size on viewport.
    const width = node.getWidth().getRaw() // px

    // TODO Replace with true, projected node size on viewport in pixels,
    // TODO so that the label threshold is based on font size.
    const indicator = tripDeltaZ - width * width

    // Show if large enough, ensure hidden otherwise.
    const label = node.getElement().querySelector('.label')
    // Check that label exists.
    if (label) {
      if (indicator < 100) {
        label.style.display = 'inline'
      } else {
        label.style.display = 'none'
      }
    }
  })
}
