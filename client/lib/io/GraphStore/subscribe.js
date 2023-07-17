module.exports = function (context, handler) {
  // Subscribe to graph event stream.
  //
  // Parameters:
  //   context
  //     a Context
  //   handler
  //     a function
  //
  const path = context.toCacheKey()
  this.on(path, handler)
}
