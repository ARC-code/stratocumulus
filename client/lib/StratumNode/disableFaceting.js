module.exports = function () {
  // Disable further faceting and instead move viewport closer.
  //
  if (this.facetingEnabled) {
    this.facetingEnabled = false
    this.enableFocusing()
  }
}
