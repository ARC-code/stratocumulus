module.exports = function () {
  // Make it possible to focus to element by clicking.
  //
  this.ontap = (ev) => {
    const nodeItem = this.component
    const viewport = this.space.getViewport()
    viewport.translateTo(nodeItem.atCenter())
    viewport.scaleBy(0.62, nodeItem.atCenter())
  }
}
