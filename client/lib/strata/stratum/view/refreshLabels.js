module.exports = function (stratum, viewport) {
  // Show/hide labels depending on visible node size.
  //
  // Parameters:
  //   stratum
  //     a stratum object
  //   viewport
  //     a tapspace viewport, required for finding node size relative to it.
  //
  const stratumPlane = stratum.div.affine
  const nodes = stratumPlane.nodeGroup.getChildren() // HACKY

  nodes.forEach((node) => {
    // Determine node size on viewport.
    const width = node.getWidth() // a Distance on node
    const widthOnViewport = width.changeBasis(viewport).getRaw()

    // Show if large enough, ensure hidden otherwise.
    const label = node.getElement().querySelector('.label')
    // Check that label exists.
    if (label) {
      if (widthOnViewport >= 20) {
        label.style.display = 'inline'
      } else {
        label.style.display = 'none'
      }
    }
  })
}
