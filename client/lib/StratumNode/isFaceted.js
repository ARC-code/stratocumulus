module.exports = function () {
  // Tell if the node is currently open.
  //
  const nodeItem = this.component
  // TODO use nodeItem.hasClass(...) once implemented
  return nodeItem.element.classList.contains('faceted-node')
}
