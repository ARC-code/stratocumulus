module.exports = function (nodeKey) {
  // Get faceting context for a substratum.
  //
  // Parameters:
  //   nodeKey
  //     a string, a facet node key.
  //
  // Return:
  //   a Context or null if node does not have substratum.
  //

  // TODO maybe build this in each CategoryNode once?

  if (!this.renderedNodes[nodeKey]) {
    throw new Error('Unknown stratum node: ' + nodeKey)
  }

  const node = this.renderedNodes[nodeKey]

  if (node.isCategoryNode) {
    if (node.facetParam) {
      if (node.isExhausted) {
        // Switch to artifacts
        return this.context.append('page', '1')
      }
      const facetParam = node.facetParam
      const facetValue = node.facetValue
      return this.context.append(facetParam, facetValue)
    }
    return null
  }

  if (node.isArtifactNode) {
    if (node.isLast) {
      if (this.context.hasParameter('page')) {
        const pageNumber = parseInt(this.context.getValue('page'))
        if (pageNumber) {
          const nextPageStr = '' + (pageNumber + 1)
          return this.context.remove('page').append('page', nextPageStr)
        } else {
          throw new Error('Invalid page number: ' + pageNumber)
        }
      } else {
        throw new Error('Unexpected artifact in non-page context: ' + nodeKey)
      }
    }
    // Only the last card has substratum.
    return null
  }

  throw new Error('Unexpected type for node: ' + nodeKey)
}
