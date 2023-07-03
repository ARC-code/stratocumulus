module.exports = function () {
  // @Context:getQueryString()
  //
  // Get the context as a query string, e.g. "f_genres.id=123&r_years=100to400"
  //
  // Return
  //   a string
  //

  const parts = this.keys.map((key, i) => {
    return key + '=' + this.values[i]
  })

  return parts.join('&')
}
