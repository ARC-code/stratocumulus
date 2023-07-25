module.exports = function (context) {
  // @Sky:filter(context)
  //
  // Filter the visible strata.
  //
  // Parameters:
  //   context
  //     a Context, the filtering context. Faceting parameters are omitted.
  //

  // TODO filter only the currently focused stratum and hide others.
  for (const path in this.strata) {
    const stratum = this.strata[path]
    stratum.filter(context)
  }
}
