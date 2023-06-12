module.exports = function (key) {
  // Facet the graph by opening a node.
  //
  // Parameters:
  //   key
  //     a node key
  //

  const attrs = this.graph.getNodeAttributes(key)

  // The click emits an event "stratumrequest" which is listened on
  // the sky-level, so that individual stratum does not need to know
  // about or control other strata.
  this.emit('stratumrequest', {
    path: key,
    label: attrs.label // Pass the node label forward.
  })
}
