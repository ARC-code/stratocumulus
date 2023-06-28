module.exports = function () {
  // This method is responsible for revealing and hiding node labels
  // according to their apparent size.
  //

  // Reveal or close labels of each loaded stratum
  const strata = Object.values(this.loader.spaces).map(space => space.stratum)

  strata.forEach(stratum => {
    stratum.revealLabels()
  })
}
