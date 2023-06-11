module.exports = function (key) {
  // Facet the graph by opening a node.
  //
  // Parameters:
  //   key
  //     a node key
  //

  const attrs = this.graph.getNodeAttributes(key)

  const facetPath = attrs.id
  const facetParam = attrs.facetParam
  const facetValue = attrs.facetValue
  const subContext = Object.assign({}, this.context)

  // Build the faceting context for the substratum.
  // The node narrows the context by its facetParam and facetValue
  // TODO maybe avoid split-join logic. Join and split in the io module?
  if (subContext[facetParam]) {
    const currentValues = subContext[facetParam].split('__')

    if (!currentValues.includes(facetValue)) {
      currentValues.push(facetValue)
    }
    subContext[facetParam] = currentValues.join('__')
  } else {
    subContext[facetParam] = facetValue
  }

  // The click emits an event "stratumrequest" which is listened on
  // the sky-level, so that individual stratum does not need to know
  // about or control other strata.
  this.emit('stratumrequest', {
    path: facetPath,
    context: subContext,
    label: attrs.label, // Pass the node label forward.
    bgColor: 'todo' // TODO
  })
}
