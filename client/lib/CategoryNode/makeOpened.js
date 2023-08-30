module.exports = function () {
  // @CategoryNode:makeOpened()
  //
  // Make the node look and behave like it has been opened.
  //
  if (!this.isFaceted) {
    this.isFaceted = true
    this.component.addClass('faceted-node')
  }
}
