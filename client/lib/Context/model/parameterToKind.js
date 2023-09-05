const facetParameters = window.stratocumulus.facetParameters

module.exports = (param) => {
  // Faceting parameter to kind string.
  //
  if (facetParameters.includes(param)) {
    const match = param.match(/^f_([a-z0-9]+).id$/i)
    if (match && match[1]) {
      return match[1]
    }
  }

  // TODO some more clear error value
  return 'grouping'
}
