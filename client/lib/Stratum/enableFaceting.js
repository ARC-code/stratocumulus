module.exports = function () {
  // Enable stratum faceting.
  // In other words, listen nodes for opening requests.
  //

  this.space.element.addEventListener('openingrequest', (ev) => {
    const nodeKey = ev.detail
    const nodeAttrs = this.graph.getNodeAttributes(nodeKey)

    const facetParam = nodeAttrs.facetParam
    const facetValue = nodeAttrs.facetValue

    // Skip non-facetable nodes.
    if (!facetParam || !facetValue) {
      return
    }

    this.emit('substratumrequest', {
      context: this.context.append(facetParam, facetValue),
      nodeKey: nodeKey
    })
  })
}
