module.exports = function (point) {
  // @StratumNode:translateTo(point)
  //
  // Move the node to a position.
  // Useful when the graph model layout has changed.
  //
  // Parameters:
  //   point
  //     a tapspace.geometry.Point
  //
  this.component.translateTo(point)
}
