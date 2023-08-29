module.exports = function (node) {
  // Get faceting context for a substratum.
  //
  // Parameters:
  //   node
  //     a StratumNode
  //
  // Return:
  //   a Context or null if the node cannot have a substratum.
  //

  // TODO maybe build this in each CategoryNode once?

  if (node.isCategoryNode) {
    if (node.facetParam) { // TODO isFacetNode OR isGateNode
      // Subcontext for the next category stratum.
      const facetParam = node.facetParam
      const facetValue = node.facetValue
      if (node.isExhausted) {
        // Switch to artifacts
        return this.context.append(facetParam, facetValue).append('page', '1')
      }
      return this.context.append(facetParam, facetValue)
    }
    return null
  }

  if (node.isArtifactNode) { // TODO remove
    if (node.isLast) {
      // Subcontext for the next page
      if (this.context.hasParameter('page')) {
        const pageNumber = parseInt(this.context.getValue('page'))
        if (pageNumber) {
          const nextPageStr = '' + (pageNumber + 1)
          return this.context.remove('page').append('page', nextPageStr)
        } else {
          throw new Error('Invalid page number: ' + pageNumber)
        }
      } else {
        throw new Error('Unexpected artifact in non-page context: ' + node.key)
      }
    }
    // Only the last card has substratum.
    return null
  }

  throw new Error('Unexpected type for node: ' + node.key)
}
