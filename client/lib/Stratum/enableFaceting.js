module.exports = function () {
  // Enable stratum faceting.
  // In other words, detect facetable nodes
  // and make them interactive.
  //

  // Construct click handler
  const onTap = (event) => {
    const targetItem = event.component
    const targetKey = targetItem.nodeKey
    const attrs = this.graph.getNodeAttributes(targetKey)

    const facetPath = attrs.id
    const facetParam = attrs.facetParam
    const facetValue = attrs.facetValue
    const newContext = Object.assign({}, this.context)

    if (newContext[facetParam]) {
      const currentValues = newContext[facetParam].split('__')

      if (!currentValues.includes(facetValue)) {
        currentValues.push(facetValue)
      }
      newContext[facetParam] = currentValues.join('__')
    } else {
      newContext[facetParam] = facetValue
    }

    // Make the node transparent or somehow allow users to see
    // the new stratum within
    // TODO use stratuNode.makeFaceted
    targetItem.addClass('faceted-node')
    targetItem.setSolidity(false)

    // The click emits an event "stratumrequest" which is listened on
    // strata-level, so that individual stratum does not need to know
    // about or control other strata.
    // TODO use targetNode.getOrigin
    // TODO adjust depth to scale
    const position = targetItem.atCenter().offset(0, 0, 10)
    this.emit('stratumrequest', {
      path: facetPath,
      context: newContext,
      label: 'todo',
      bgColor: 'todo',
      position: position,
      scale: targetItem.getScale()
    })
  }

  const nodeKeys = Object.keys(this.renderedNodes)

  const facetableKeys = nodeKeys.filter(nodeKey => {
    return this.graph.getNodeAttribute(nodeKey, 'isFacetable')
  })

  facetableKeys.forEach(nodeKey => {
    const stratumNode = this.renderedNodes[nodeKey]
    const nodeItem = stratumNode.component
    // Prevent duplicate interaction setup
    if (!nodeItem.interactiveNode) {
      nodeItem.interactiveNode = true // TODO use some tapspace method to test
      nodeItem.tappable({ preventDefault: false })
      nodeItem.on('tap', onTap)
    }
  })
}
