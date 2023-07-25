const io = require('../io')

module.exports = (context) => {
  // Make label text.
  //
  // Return
  //   a string
  //

  // Print facets
  const facetContext = context.filter(key => {
    return key.startsWith('f')
  })
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

  // // Print filters
  // let filterLabel = ''
  // const keywordContext = context.getValue('q')
  // const timeContext = context.getRangeValue('r_years')
  // if (timeContext) {
  //   const y0 = timeContext.rangeStart
  //   const y1 = timeContext.rangeEnd
  //   filterLabel += '<span class="time-range-context">' +
  //     'between ' + y0 + '–' + y1 + ' AD' +
  //     '</span>'
  // }
  // if (keywordContext) {
  //   if (timeContext) {
  //     filterLabel += '<br>'
  //   }
  //   filterLabel += '<span class="keyword-context">' +
  //     'containing "' + keywordContext + '"' +
  //     '</span>'
  // }

  return facetLabel // + '<br>' + filterLabel
}
