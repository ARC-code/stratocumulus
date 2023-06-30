module.exports = function () {
  // Construct a stratum path that is unique among the strata.
  //
  // Return
  //   a string
  //
  const paths = this.trail.concat([this.path]).filter(p => p !== '/')
  return '/' + paths.map(p => p.slice(-4)).join('/')
}
