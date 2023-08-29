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

      // Build context for the stratum of this node.
      // TODO exhausted nodes should also put page.
      let subcontext = this.context
      subcontext = subcontext.append(facetParam, facetValue)
      if (nodeAttrs.value < 100 || nodeAttrs.isExhausted) {
        subcontext = subcontext.remove('page').append('page', '1')
      }

      this.emit('substratumrequest', {
        context: subcontext
      })
    }
  }

  const spaceEl = this.space.element

  // Prevent duplicate listener by removing the previous.
  spaceEl.removeEventListener('openingrequest', this.onopeningrequest)

  // Listen for nodes
  spaceEl.addEventListener('openingrequest', this.onopeningrequest)
}
