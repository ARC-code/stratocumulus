module.exports = function () {
  // Get faceting context for the superstratum.
  // Basically takes the stratum context, removes own path from the context
  // and returns the reduced context as the superstratum context.
  //
  // Return
  //   a StratumContext
  //

  if (this.path === '/') {
    // substratum is already a root.
    return {}
  }

  // Facet parameter and value are encoded into the stratum path. Extract.
  const parts = this.path.split('/').filter(str => str.length > 0)
  if (parts.length !== 3) {
    // Likely root
    if (parts.length !== 0) {
      console.warn('Unexpected stratum path: ' + this.path)
    }
    return {}
  }

  const facetParam = 'f_' + parts[1] + '.id'
  const facetValue = parts[2]

  const subContext = this.context
  const superContext = Object.assign({}, subContext)

  // Build the faceting context for the superstratum.
  // Practically, remove the substratum faceting value from the context.

  const subValues = subContext[facetParam].split('__')
  const superValues = subValues.filter(facetId => {
    return facetId !== facetValue
  })

  // Replace with reduced value or delete completely if empty.
  if (superValues.length > 0) {
    superContext[facetParam] = superValues.join('__')
  } else {
    delete superContext[facetParam]
  }

  return superContext
}
