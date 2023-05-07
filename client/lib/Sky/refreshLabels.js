module.exports = function () {
  // Refresh labels.
  // A semantic zoom feature: show labels of nodes that are close enough.
  //

  // For each stratum
  Object.values(this.strata).forEach(stratum => {
    stratum.revealLabels()
  })
}
