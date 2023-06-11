module.exports = function (parentPath) {
  // Get substrata paths.
  //
  // Parameters:
  //   parentPath
  //     a string, the superstratum path.
  //
  // Return:
  //   array of string
  //
  const stratum = this.strata[parentPath]
  if (!stratum) {
    return []
  }
  const nodeKeys = stratum.graph.nodes()
  return nodeKeys
}
