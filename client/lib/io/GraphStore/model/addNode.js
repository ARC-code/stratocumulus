const mergeNodeAttributes = require('./mergeNodeAttributes')

module.exports = function (graph, nodeAttrs) {
  // Add a single node to the graph.
  // Useful to initiate the graph with a single node.
  // Does nothing if the node already exists.
  //

  const nodeKey = nodeAttrs.id

  if (graph.hasNode(nodeKey)) {
    // Skip existing.
    return
  }

  // Construct a new node
  const newNodeAttrs = mergeNodeAttributes({
    id: nodeKey,
    label: nodeAttrs.label,
    value: 0,
    size: 0,
    fixed: false,
    parent: null,
    isFacetable: true,
    // TODO isFaceted: true,
    facetParam: null,
    facetValue: null,
    stale: false // for cache invalidation during filtering TODO?
  }, nodeAttrs)

  graph.addNode(nodeKey, newNodeAttrs)
}
