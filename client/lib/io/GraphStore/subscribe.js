module.exports = function (context, handler) {
  // @GraphStore:subscribe(context, handler)
  //
  // Subscribe to graph event stream.
  //
  // Parameters:
  //   context
  //     a Context
  //   handler
  //     a function
  //
  const path = context.toFacetPath()
  this.on(path, handler)
}
