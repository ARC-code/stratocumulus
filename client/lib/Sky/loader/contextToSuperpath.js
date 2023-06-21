module.exports = (context) => {
  // Just pick one of the id values and convert it to path.
  //
  // Parameters:
  //   context
  //     an object
  //
  // Return
  //   a string, a stratum path
  //
  const facetParams = Object.keys(context)
  const idParams = facetParams.filter(paramName => {
    return paramName.endsWith('.id')
  })

  if (idParams.length === 0) {
    // Root
    return '/'
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
