const template = require('./template')
const sizing = require('../config').sizing

module.exports = function (attrs) {
  // CategoryNode:render(attrs)
  //
  // Parameters:
  //   attrs
  //     graph model node attributes
  //

  let nSize = sizing.minNodeSize
  if ('size' in attrs) {
    nSize = attrs.size
  }

  const nodeIsStale = attrs.stale
  const nodeValue = attrs.value || 0
  if (nodeValue < 0.1 || nodeIsStale) {
    nSize = nSize / 2
    this.component.addClass('empty-node')
  } else {
    this.component.removeClass('empty-node')
  }

  // Derive scale relative to the stratum plane.
  this.component.setScale(0.6 * nSize / sizing.maxNodeSize)

  // Just render again and replace
  this.component.html(template(attrs))
}
