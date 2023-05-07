module.exports = function (onTap) {
  // Prevent duplicate interaction setup
  if (!this.facetingEnabled) {
    this.facetingEnabled = true
    // Replace tap handler
    this.ontap = onTap
  }
}
