module.exports = function (context, handler) {
  // Unsubscribe from graph event stream.
  //
  // Parameters:
  //   context
  //     a Context
  //   handler
  //     optional function
  //

  const path = context.toFacetPath()

  if (typeof handler === 'function') {
    this.off(path, handler)
  } else {
    this.off(path)
  }
}
