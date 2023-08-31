require('./style.css')
const tapspace = require('tapspace')
const turn = 2 * Math.PI

const Spinner = function (opts) {
  // @Spinner
  //
  // N nodes rotating.
  //
  // Gives transparent and easy to configure loading animation.
  //
  const d = opts.diameter || 50
  const n = opts.circles || 5
  const c = opts.circleDiameter || 10
  const r = d / 2

  const plane = tapspace.createPlane()

  const carousel = tapspace.createItem()
  carousel.setSize(d + c + c, d + c + c)
  carousel.setAnchor(carousel.atCenter())
  carousel.addClass('spinner')
  carousel.addClass('loading')
  plane.addChild(carousel)
  plane.setAnchor(carousel.atCenter())

  const origin = carousel.atCenter()

  const circles = []
  for (let i = 0; i < n; i += 1) {
    const circle = tapspace.createNode(c)
    circle.addClass('spinner-circle')
    circle.setAnchor(circle.atCenter())
    circles.push(circle)

    carousel.addChild(circle)
    circle.translateTo(origin.polarOffset(r, i * turn / n))
  }

  this.carousel = carousel
  this.component = plane
}

module.exports = Spinner
const proto = Spinner.prototype
proto.isSpinner = true

proto.stop = require('./stop')
