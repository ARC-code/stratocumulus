module.exports = function () {
  // Make the node look like it has been opened.
  //
  const nodeItem = this.component
  nodeItem.addClass('faceted-node')
  this.disableFaceting()
}
