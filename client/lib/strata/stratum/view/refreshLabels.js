module.exports = function (stratum, space) {
  // Show/hide labels depending on visible node size.
  //
  // Parameters:
  //   stratum
  //     a stratum object
  //   space
  //     a tapspace space, required for finding node size relative to viewport.
  //
  const stratumPlane = stratum.div.affine
  const nodes = stratumPlane.nodeGroup.getChildren() // HACKY

  nodes.forEach((node) => {
    // Determine node size on viewport.
    const size = node.getWidth() // a Distance on node
    const sizeOnViewport = size.changeBasis(space).getRaw()

    // Show if large enough, ensure hidden otherwise.
    const label = node.getElement().querySelector('.label')
    // Check that label exists.
    if (label) {
      if (sizeOnViewport >= 20) {
        label.style.display = 'inline'
      } else {
        label.style.display = 'none'
      }
    }
  })
}
