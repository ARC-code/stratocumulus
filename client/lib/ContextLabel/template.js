const io = require('../io')

module.exports = (context, numArtifacts) => {
  // Make label text.
  //
  // Return
  //   a string
  //

  let prefix = 'Documents within<br>'

  // Artifact count
  if (numArtifacts === 0) {
    prefix = 'No documents within<br>'
  }

  // Print facets
  const facetContext = context.getFacetingContext()
  const labels = facetContext.map((facetParam, facetValue) => {
    const label = io.labelStore.read(facetParam, facetValue)
    return label || facetParam
  })
  const labelCount = labels.length

  if (labelCount === 0) {
    prefix = 'All documents'
  }

  let facetLabel = ''
  if (labelCount > 0) {
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

  return prefix + facetLabel
}
