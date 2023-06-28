module.exports = function (subPath, superPath) {
  // Get faceting context for superstratum.
  // Basically takes the substratum context, removes subpath from the context
  // and returns the reduced context as the superstratum context.
  //
  // Parameters:
  //   subPath
  //     a substratum path. This stratum exists.
  //   superPath
  //     a superstratum path. This stratum does not yet exist.
  //
  // Return
  //   a StratumContext
  //
  const stratum = this.strata[subPath]
  if (!stratum) {
    throw new Error('Cannot retrieve context for superstratum: unknown child')
  }

  const subContext = stratum.context

  if (superPath === null || subPath === '/') {
    // substratum is already a root.
    return {}
  }

  // Facet parameter and value are encoded into the stratum path. Extract.
  const parts = superPath.split('/').filter(str => str.length > 0)
  if (parts.length !== 3) {
    // Likely root
    if (parts.length !== 0) {
      console.warn('Unexpected stratum path: ' + superPath)
    }
    return {}
  }

  const facetParam = 'f_' + parts[1] + '.id'
  const facetValue = parts[2]

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
