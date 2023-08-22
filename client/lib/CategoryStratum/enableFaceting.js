module.exports = function () {
  // Enable stratum faceting.
  // In other words, listen nodes for opening requests.
  //

  // Define listener once
  if (!this.onopeningrequest) {
    this.onopeningrequest = (ev) => {
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
    }
  }

  const spaceEl = this.space.element

  // Prevent duplicate listener by removing the previous.
  spaceEl.removeEventListener('openingrequest', this.onopeningrequest)

  // Listen for nodes
  spaceEl.addEventListener('openingrequest', this.onopeningrequest)
}
