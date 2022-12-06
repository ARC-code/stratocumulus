module.exports = function (stratumPath, edgeKey) {
  // Prefix edge ids with stratum path to prevent id collisions across strata.
  //
  // Parameters:
  //   stratumPath
  //     string, identifies the stratum network the edge belongs to.
  //   edgeKey
  //     string, the edge identifier within the stratum.
  //
  // Return
  //   a string, suitable for HTMLElement id.
  //
  return `${stratumPath}${edgeKey}`.replaceAll('/', '_')
}
