const tapspace = require('tapspace')
const ContextLabel = require('../ContextLabel')

module.exports = function () {
  // Render or update the large text label
  // that tells the user how the stratum was formed.

  if (this.contextLabel) {
    // Update label.
    this.contextLabel.update(this.context)
  } else {
    // Create label.
    this.contextLabel = new ContextLabel(this.context)
    this.space.addChild(this.contextLabel.component) // TODO label.setParent?
  }

  const bbox = new tapspace.geometry.Box(this.space, {
    a: 1,
    b: 0,
    x: 0,
    y: 0,
    z: 0,
    w: this.renderSize,
    h: this.renderSize,
    d: 0
  })
  this.contextLabel.alignToBox(bbox)
}