module.exports = function () {
  // This method is responsible for semantic zoom features
  // and managint the spaces to allow infinite depth.
  //
  // - show/hide labels according to their size
  // - open and close strata
  //

  // For each stratum
  Object.values(this.strata).forEach(stratum => {
    stratum.revealLabels()
  })
}
