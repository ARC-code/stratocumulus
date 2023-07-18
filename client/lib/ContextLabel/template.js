const io = require('../io')

module.exports = (context) => {
  // Make label text.
  //
  // Return
  //   a string
  //
  const facetContext = context.filter(key => {
    return key.startsWith('f')
  })
  // TODO print also filtering
  // const filteringContext = context.filter(key => {
  //   return key.startsWith('q') || key.startsWith('r')
  // })

  const labels = facetContext.map((facetParam, facetValue) => {
    const label = io.labelStore.read(facetParam, facetValue)
    return label || facetParam
  })

  const len = labels.length

  if (len === 0) {
    return 'All documents'
  }
  const base = 'Documents within<br>'

  // Single facet.
  if (len === 1) {
    return base + labels[0]
  }

  // Many facets. Join by commas and 'and'
  const commas = labels.slice(0, len - 1).join(', ')
  return base + commas + ' and ' + labels[len - 1]
}
