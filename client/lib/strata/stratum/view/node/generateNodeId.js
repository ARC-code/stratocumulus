module.exports = function (stratumPath, nodeKey) {
  // Prefixing node ids with path to prevent id collisions across strata
  return `${stratumPath}${nodeKey}`.replaceAll('/', '_')
}
