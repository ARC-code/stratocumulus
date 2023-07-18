const io = require('../io')

module.exports = (context) => {
  // Make label text.
  //
  // Return
  //   a string
  //
  const base = 'Documents within'
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

  if (labels.length > 0) {
    // TODO replace last comma with 'and'.
    return base + '<br>' + labels.join(', ')
  }
  // Else
  return 'All documents'
}
