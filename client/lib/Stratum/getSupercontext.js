module.exports = function () {
  // Get faceting context for the superstratum.
  // Basically takes the stratum context, and returns a new context
  // with the last faceting parameter removed.
  //
  // Return
  //   a Context or null is stratum is root.
  //
  if (this.path === '/') {
    return null
  }

  if (this.context.hasParameter('page')) {
    const pageNumber = parseInt(this.context.getValue('page'))
    if (pageNumber) {
      if (pageNumber <= 1) {
        // Switch from artifacts to categories.
        return this.context.remove('page')
      } else {
        // Goto previous page.
        const prevPageStr = '' + (pageNumber - 1)
        return this.context.remove('page').append('page', prevPageStr)
      }
    } else {
      console.error('Invalid page number: ' + pageNumber)
    }
  }

  return this.context.removeLastFacet()
}
