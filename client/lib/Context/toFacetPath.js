const facetParameters = window.stratocumulus.facetParameters

module.exports = function () {
  // @Context:toFacetPath()
  //
  // Build a local URL path and facet query from the context.
  // A facet path begins with a slash and contain only faceting queries.
  //
  // Return
  //   a string, for example "/?f_genres.id=123"
  //

  if (this.keys.length === 0) {
    return '/'
  }

  const facetKeys = []
  const facetValues = []

  this.keys.forEach((key, i) => {
    if (facetParameters.includes(key)) {
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
