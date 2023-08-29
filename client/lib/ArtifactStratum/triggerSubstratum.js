module.exports = function (viewport) {
  // @ArtifactStratum:triggerSubstratum(viewport)
  //
  // This method implements viewport dependent behavior
  // that subsequently initiates the loading of substratum if
  // zoom level and other viewport conditions so allow.
  //
  // Parameters:
  //   viewport
  //     a tapspace.components.Viewport
  //

  // TODO base on the size of the last node.

  const viewportArea = viewport.getBoundingBox().getArea().getRaw()
  const stratumArea = this.boundingCircle.getArea().transitRaw(viewport)
  const areaRatio = stratumArea / viewportArea

  if (areaRatio < 0.5) {
    // Too small for next page.
    return
  }

  // Build the subcontext.
  if (!this.context.hasParameter('page')) {
    // Bad context
    const msg = this.context.toQueryString()
    throw new Error('Unexpected non-page context: ' + msg)
  }

  const pageNumber = parseInt(this.context.getValue('page'))
  if (!pageNumber) {
    throw new Error('Invalid page number: ' + pageNumber)
  }

  const nextPageStr = '' + (pageNumber + 1)
  const subcontext = this.context.remove('page').append('page', nextPageStr)

  // Trigger loading of the substratum.
  this.emit('substratumrequest', {
    context: subcontext
  })
}
