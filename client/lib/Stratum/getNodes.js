module.exports = function () {
  // @Stratum:getNodes()
  //
  // Get stratum nodes in an array.
  //
  // Return
  //   array of StratumNode
  //
  return Object.values(this.renderedNodes)
}
