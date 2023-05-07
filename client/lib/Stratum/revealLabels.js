module.exports = function () {
  // Refresh the label visibility in a semantic zoom manner.
  // Reveals and hides the labels based on their apparent size.
  //

  if (!this.alive) {
    // Stratum already removed, no need to refresh anything.
    return
  }

  const viewport = this.space.getViewport()
  const nodes = Object.values(this.renderedNodes)

  nodes.forEach((node) => {
    const nodeItem = node.component
    const dilation = viewport.measureDilation(nodeItem)

    if (dilation > 0.05 && dilation < 10) {
      nodeItem.addClass('readable')
    } else {
      nodeItem.removeClass('readable')
    }
  })
}
