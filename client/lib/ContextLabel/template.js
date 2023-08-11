const io = require('../io')

module.exports = (context) => {
  // Make label text.
  //
  // Return
  //   a string
  //

  // Print facets
  const facetContext = context.getFacetingContext()
  const labels = facetContext.map((facetParam, facetValue) => {
    const label = io.labelStore.read(facetParam, facetValue)
    return label || facetParam
  })
  const labelCount = labels.length

  let facetLabel = 'All documents'
  if (labelCount === 0) {
    facetLabel = 'All documents'
  } else {
    facetLabel = 'Documents within<br>'
    // Single facet.
    if (labelCount === 1) {
      facetLabel += labels[0]
    } else if (labelCount === 2) {
      facetLabel += labels[0] + ' and ' + labels[1]
    } else {
      // Many facets. Join by commas and 'and'
      const commas = labels.slice(0, labelCount - 1).join(', ')
      facetLabel += commas + ', and ' + labels[labelCount - 1]
    }
  }

  return facetLabel
}
