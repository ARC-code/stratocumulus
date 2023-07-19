module.exports = function (beginYear, endYear) {
  // Emphasize each stratum nodes by the year range.
  //
  // Parameters
  //   beginYear
  //     a number, inclusive year
  //   endYear
  //     a number, inclusive year
  //

  for (const path in this.strata) {
    this.strata[path].emphasizeDecades(beginYear, endYear)
  }
}
