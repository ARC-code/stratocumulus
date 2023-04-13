module.exports = function (stratumPath, nodeKey) {
  // Prefix node ids with stratum path to prevent id collisions across strata.
  //
  // Parameters:
  //   stratumPath
  //     string, identifies the stratum network the node belongs to.
  //   nodeKey
  //     string, node identifier within the stratum.
  //
  // Return
  //   a string, suitable for HTMLElement id.
  //

  // Remove trailing slash.
  // Root is a special path as it begins and ends with the same slash.
  if (stratumPath.endsWith('/')) {
    stratumPath = stratumPath.substring(0, stratumPath.length - 1)
  }

  return (stratumPath + nodeKey).replaceAll('/', '_')
}
