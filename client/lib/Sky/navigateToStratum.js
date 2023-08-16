module.exports = function (context) {
  // Jump viewport to certain stratum and load the path if needed.
  //
  // Parameters
  //   context
  //     a Context, defines the current stratum.
  //

  const path = context.toFacetPath()
  console.log('navigate to', path)
  // TODO
  // this.loader.init(path, basis) .goto(path, basis) .moveTo(path, basis)

  // TODO prevent re-navigation where we already are.
}
