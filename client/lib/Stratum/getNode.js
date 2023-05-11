module.exports = function (nodeKey) {
  // Get node by key. Can be null.
  //
  // Parameters:
  //   nodeKey
  //
  // Return
  //   a StratumNode or null
  //

  const stratumNode = this.renderedNodes[nodeKey]

  if (stratumNode) {
    return stratumNode
  }

  return null
}
