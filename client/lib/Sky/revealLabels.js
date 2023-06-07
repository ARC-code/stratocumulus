module.exports = function () {
  // This method is responsible for revealing and hiding node labels
  // according to their apparent size.
  //

  // Reveal or close labels of each stratum
  Object.values(this.strata).forEach(stratum => {
    stratum.revealLabels()
  })
}
