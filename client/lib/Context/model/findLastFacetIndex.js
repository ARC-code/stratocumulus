const facetParameters = window.stratocumulus.facetParameters

module.exports = (keys) => {
  // Find last faceting parameter.
  //
  const len = keys.length
  let last = -1
  for (let i = 0; i < len; i += 1) {
    if (facetParameters.includes(keys[i])) {
      last = i
    }
  }

  return last
}
