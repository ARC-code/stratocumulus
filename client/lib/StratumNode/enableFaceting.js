module.exports = function (onTap) {
  const nodeItem = this.component

  // Prevent duplicate interaction setup
  if (!nodeItem.interactiveNode) {
    nodeItem.interactiveNode = true
    // TODO use some tapspace method to test interactivity
    nodeItem.tappable({ preventDefault: false })
    nodeItem.on('tap', onTap)
  }
}
