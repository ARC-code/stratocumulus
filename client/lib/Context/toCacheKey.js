module.exports = function () {
  // @Context:toCacheKey()
  //
  // Build a cache key from the context.
  // Excludes r_years parameter.
  //
  // Return
  //   a string, for example "/?f_genres.id=123"
  //

  if (this.keys.length === 0) {
    return '/'
  }

  const cacheKeys = []
  const cacheValues = []

  // Facets first
  this.keys.forEach((key, i) => {
    if (key.startsWith('f_')) {
      cacheKeys.push(key)
      cacheValues.push(this.values[i])
    }
  })

  // Queries second
  this.keys.forEach((key, i) => {
    if (key.startsWith('q')) {
      cacheKeys.push(key)
      cacheValues.push(this.values[i])
    }
  })

  if (cacheKeys.length === 0) {
    return '/'
  }

  const parts = cacheKeys.map((fkey, i) => {
    return fkey + '=' + cacheValues[i]
  })

  return '/?' + parts.join('&')
}
