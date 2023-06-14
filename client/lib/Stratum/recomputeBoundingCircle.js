const tapspace = require('tapspace')

module.exports = function () {
  const sphere = this.nodePlane.getBoundingCircle()
  // TODO tapspace should return Circle, not Sphere
  const circle = new tapspace.geometry.Circle(sphere.basis, sphere.sphere)

  this.boundingCircle = circle
}
