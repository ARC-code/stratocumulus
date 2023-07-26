const config = require('../config')

module.exports = function () {
  // @Context:toCacheKey()
  //
  // Build a cache key from the context.
  // Cache key has consistent order for the context parameters,
  // putting the filtering keys last.
  //
  // Return
  //   a string, for example "/?f_genres.id=123"
  //

  if (this.keys.length === 0) {
    return '/'
  }

  const cacheKeys = []
  const cacheValues = []
  const filterKeys = []
  const filterValues = []

  // Split
  this.keys.forEach((key, i) => {
    if (config.filterParameters.includes(key)) {
      filterKeys.push(key)
      filterValues.push(this.values[i])
    } else if (config.facetParameters.includes(key)) {
      cacheKeys.push(key)
      cacheValues.push(this.values[i])
    }
  })

  // Append filters into paths in a consistent order.
  config.filterParameters.forEach(param => {
    const i = filterKeys.indexOf(param)
    if (i >= 0) {
      cacheKeys.push(filterKeys[i])
      cacheValues.push(filterValues[i])
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
