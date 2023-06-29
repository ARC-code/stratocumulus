module.exports = function () {
  // Computation of bounding circle can be heavy, thus this method
  // computes it at demand.
  const circle = this.nodePlane.getBoundingCircle()
  this.boundingCircle = circle.changeBasis(this.space)
}
