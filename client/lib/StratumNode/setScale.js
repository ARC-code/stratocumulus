module.exports = function (scale) {
  // @StratumNode:setScale(scale)
  //
  // Rescale the node.
  // Useful when the graph model layout has changed.
  //
  // Parameters:
  //   scale
  //     a non-negative number
  //
  this.component.setScale(scale)
}
