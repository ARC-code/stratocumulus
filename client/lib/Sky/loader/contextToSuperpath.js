module.exports = (context) => {
  // Get a stratum path from the context of a substratum.
  // Practically just pics one of the f_xxx.id faceting parameters
  // and converts it to a stratum path.
  //
  // Parameters:
  //   context
  //     an object
  //
  // Return
  //   a string, the superstratum path
  //   null, if the stratum is already a root.
  //
  const facetParams = Object.keys(context)
  const idParams = facetParams.filter(paramName => {
    return paramName.endsWith('.id')
  })

  if (idParams.length === 0) {
    // Root
    return null
  }

  const superparam = idParams[0]
  const supervalue = context[superparam]

  const groupNamePattern = /^f_([a-z0-9]+)\.id$/i

  const groupNameMatch = superparam.match(groupNamePattern)

  if (!groupNameMatch) {
    throw new Error('Unexpected faceting parameter name: ' + superparam)
  }

  const groupName = groupNameMatch[1]

  // TODO remove hardcoded arc
  return `/arc/${groupName}/${supervalue}`
}
