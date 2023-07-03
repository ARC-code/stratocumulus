module.exports = function () {
  // @Context:toStratumPath()
  //
  // Build a stratum path from the context e.g. "/?f_genres.id=123".
  // Stratum paths begin with slash and contain only faceting queries.
  //
  // Return
  //   a string
  //

  if (this.keys.length === 0) {
    return '/'
  }

  const facetKeys = []
  const facetValues = []

  this.keys.forEach((key, i) => {
    if (key.startsWith('f_')) {
      facetKeys.push(key)
      facetValues.push(this.values[i])
    }
  })

  if (facetKeys.length === 0) {
    // Only filtering params.
    return '/'
  }

  const parts = facetKeys.map((fkey, i) => {
    return fkey + '=' + facetValues[i]
  })

  return '/?' + parts.join('&')
}
