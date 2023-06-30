module.exports = function () {
  // Construct substratum paths that are unique among the strata.
  //
  // Return
  //   array of string
  //
  const upath = this.getUniquePath()
  const cpaths = this.getSubpaths()
  return cpaths.map(p => {
    return upath + '/' + p.slice(-4)
  })
}
