module.exports = function () {
  // Construct a superstratum path that is unique among the strata.
  //
  // Return
  //   a string
  //
  const paths = this.trail.filter(p => p !== '/')
  return '/' + paths.map(p => p.slice(-4)).join('/')
}
