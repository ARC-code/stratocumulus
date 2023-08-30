module.exports = function () {
  // @CategoryNode:makeClosed()
  //
  // Make the node look and behave like it has been closed.
  //
  if (this.isFaceted) {
    this.isFaceted = false
    this.component.removeClass('faceted-node')
  }
}
