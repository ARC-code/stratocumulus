module.exports = function (subpath) {
  // Construct unique substratum path.
  //
  // Return
  //   array of string
  //
  const upath = this.getUniquePath()
  return upath + '/' + subpath.slice(-4)
}
