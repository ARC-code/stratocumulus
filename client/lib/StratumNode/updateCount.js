const nodeTemplate = require('./nodeTemplate')
const sizing = require('../config').sizing

module.exports = function (attrs) {
  // StratumNode:updateCount(attrs)
  //
  // Parameters:
  //   attrs
  //     graph model node attributes

  let nSize = sizing.minNodeSize
  if ('size' in attrs) {
    nSize = attrs.size
  }

  // Derive scale relative to the stratum plane.
  this.component.setScale(0.6 * nSize / sizing.maxNodeSize)

  // Just render again and replace
  this.component.html(nodeTemplate('', attrs))

  // TODO need to reset anchor?

  // const newSize = { w: nSize, h: nSize }
  // nElem.affine.resizeTo(newSize, nElem.affine.atCenter())

  // const roundElement = nElem.querySelector('.node')
  // const countElement = nElem.querySelector('.node-label-count')
  //
  // const nodeIsStale = attrs.stale
  // const nodeValue = attrs.value
  // if (nodeValue < 0.1 || nodeIsStale) {
  //   roundElement.classList.add('empty-node')
  // } else {
  //   roundElement.classList.remove('empty-node')
  // }

  // // Update the label count. Some nodes do not have counts.
  // // Stale nodes have unknown count.
  // if (countElement) {
  //   if (nodeIsStale) {
  //     // Still waiting for valid count
  //     countElement.innerText = '***'
  //   } else {
  //     // Add thousands separator for readability
  //     countElement.innerText = nodeValue.toLocaleString('en-US')
  //   }
  // }
}
