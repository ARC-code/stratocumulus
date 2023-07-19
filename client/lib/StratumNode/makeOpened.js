module.exports = function () {
  // Make the node look and behave like it has been opened.
  //
  if (this.isFacetable && !this.isFaceted) {
    this.isFaceted = true
    this.component.addClass('faceted-node')
  }
}
