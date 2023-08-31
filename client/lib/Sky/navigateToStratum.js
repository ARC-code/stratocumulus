module.exports = function (context) {
  // @Stratum:navigateToStratum(context)
  //
  // Jump viewport to certain stratum and load the path if needed.
  //
  // Parameters
  //   context
  //     a Context, defines the current stratum.
  //

  const facetPath = context.toFacetPath()

  if (this.loader.hasSpace(facetPath)) {
    // Space for the context exists already.
    // No need to reset the spaces.
    // TODO Navigate to it, unless navigation itself caused the fn call.
    // const space = this.loader.getSpace(facetPath)
    // const stratum = space.stratum
    // this.viewport.zoomToFill(stratum.nodePlane, 0.5)
    return
  }

  // Space does not exist. Close all spaces and then re-initialize the loader.
  this.loader.closeAll()
  const defaultBasis = this.viewport.getBasisAt(this.viewport.atCenter())
  const eventData = { context: context }
  const openingDepth = 0
  this.loader.initSpace(facetPath, defaultBasis, openingDepth, eventData)
}
