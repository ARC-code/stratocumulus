module.exports = function (key) {
  // Facet the graph by opening a node.
  //

  const stratumNode = this.renderedNodes[key]
  const attrs = this.graph.getNodeAttributes(key)

  const facetPath = attrs.id
  const facetParam = attrs.facetParam
  const facetValue = attrs.facetValue
  const subContext = Object.assign({}, this.context)

  if (subContext[facetParam]) {
    const currentValues = subContext[facetParam].split('__')

    if (!currentValues.includes(facetValue)) {
      currentValues.push(facetValue)
    }
    subContext[facetParam] = currentValues.join('__')
  } else {
    subContext[facetParam] = facetValue
  }

  // Make the node transparent or somehow allow users to see
  // the new stratum within
  stratumNode.makeFaceted()

  // The click emits an event "stratumrequest" which is listened on
  // the sky-level, so that individual stratum does not need to know
  // about or control other strata.
  // TODO use targetNode.getOrigin
  // TODO adjust depth to scale
  const position = stratumNode.getOrigin().offset(0, 0, -1)
  this.emit('stratumrequest', {
    path: facetPath,
    context: subContext,
    label: 'todo',
    bgColor: 'todo',
    position: position,
    scale: stratumNode.getScale()
  })
}
