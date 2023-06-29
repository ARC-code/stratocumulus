const groupNamePattern = /^f_([a-z0-9]+)\.id$/i

module.exports = (path, context, trail) => {
  // Get a stratum path from the context of a substratum.
  // Practically just pics one of the f_xxx.id faceting parameters
  // and converts it to a stratum path.
  //
  // Parameters:
  //   path
  //     a substratum path
  //   context
  //     an object, the substratum context
  //   trail
  //     an array of stratum paths
  //
  // Return
  //   a string, the superstratum path
  //   null, if the stratum context is already a root.
  //
  const facetParams = Object.keys(context)
  const idParams = facetParams.filter(paramName => {
    return paramName.endsWith('.id')
  })

  if (idParams.length === 0) {
    // The given context is the root context.
    return null
  }

  if (idParams.length === 1) {
    // The given context is for a substratum of the root.
    return '/'
  }

  // Assert: context has more than one idParameter.

  // Convert faceting parameters to possible paths
  const superPaths = idParams.map(superparam => {
    const supervalue = context[superparam]

    const groupNameMatch = superparam.match(groupNamePattern)

    if (!groupNameMatch) {
      throw new Error('Unexpected faceting parameter name: ' + superparam)
    }

    const groupName = groupNameMatch[1]

    // TODO remove hardcoded arc
    return `/arc/${groupName}/${supervalue}`
  })

  // Pick the first that is not the substratum path itself.
  const superpath = superPaths.find(p => p !== path)

  if (!superpath) {
    console.warn('No superpath found in context', context)
    return '/'
  }

  return superpath
}
