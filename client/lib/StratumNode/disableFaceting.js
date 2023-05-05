module.exports = function (onTap) {
  // Disable further interaction.
  //
  const nodeItem = this.component

  nodeItem.off('tap')
  nodeItem.tappable(false)
  nodeItem.interactiveNode = false
}
