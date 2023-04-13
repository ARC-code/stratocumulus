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

  // Remove trailing slash.
  // Root is a special path as it begins and ends with the same slash.
  if (stratumPath.endsWith('/')) {
    stratumPath = stratumPath.substring(0, stratumPath.length - 1)
  }

  return (stratumPath + edgeKey).replaceAll('/', '_')
}
