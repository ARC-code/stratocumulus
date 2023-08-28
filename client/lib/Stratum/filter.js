module.exports = function (context) {
  // @Stratum:filter(context)
  //
  // A placeholder that ensures subclasses implement the method.
  //
  // Filter the stratum by a filtering context.
  //
  // Parameters:
  //   context
  //     a Context. The context can include faceting parameters but
  //     .. only filtering parameters have effect here.
  //
  throw new Error('Subclasses must implement the filter method.')
}
