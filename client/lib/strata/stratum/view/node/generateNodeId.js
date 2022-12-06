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
  return `${stratumPath}${nodeKey}`.replaceAll('/', '_')
}
