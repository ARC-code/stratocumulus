module.exports = function () {
  // Computation of bounding circle can be heavy, thus this method
  // computes it at demand.
  this.boundingCircle = this.nodePlane.getBoundingCircle()
}
