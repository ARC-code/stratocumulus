module.exports = function () {
  // Refresh labels.
  // A semantic zoom feature: show labels of nodes that are close enough.
  //
  // DEV NOTE: this looks like a method. Maybe have class for strata?
  //

  // For each stratum
  Object.values(this.strata).forEach(stratum => {
    stratum.refresh()
  })
}
