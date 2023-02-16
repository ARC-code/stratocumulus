const config = require('../../../config')
const normalizeSize = require('./normalizeSize')

const kindColorMap = config.kindColorMap
const defaultColor = config.defaultColor

module.exports = function (graph, subgraph) {
  // Update the graph object with a subgraph received from the server.
  //
  // Parameters:
  //   graph
  //     a graph to update. Will be modified.
  //   subgraph
  //     object, received from the server, has optional properties:
  //       nodes
  //         optional array of node objects. Each node object has properties:
  //           id
  //           label
  //           value
  //           fixed
  //           parent
  //           facet_param
  //           facet_value
  //       edges
  //         optional array of edge objects
  //
  if ('nodes' in subgraph) {
    subgraph.nodes.forEach(n => {
      // Ensure no such node exists yet.
      // Server might send some nodes multiple times.
      if (graph.hasNode(n.id)) {
        console.warn(`Duplicate for node ${n.id} detected.`) // DEBUG
        return
      }

      const attrs = {
        id: n.id,
        label: n.label,
        color: defaultColor,
        value: 0,
        size: 0,
        fixed: false,
        parent: null,
        isFacetable: false,
        facetParam: null,
        facetValue: null
      }

      if ('kind' in n && n.kind in kindColorMap) {
        attrs.color = kindColorMap[n.kind]
      }

      if ('value' in n) {
        attrs.value = n.value
        attrs.size = normalizeSize(n.value)
      }
      if ('fixed' in n) attrs.fixed = n.fixed
      if ('parent' in n) attrs.parent = n.parent
      if ('is_facetable' in n) attrs.isFacetable = n.is_facetable
      if ('facet_param' in n) attrs.facetParam = n.facet_param
      if ('facet_value' in n) attrs.facetValue = n.facet_value

      graph.addNode(n.id, attrs)
    })
  }

  if ('edges' in subgraph) {
    subgraph.edges.forEach(e => graph.addEdge(e.from, e.to))
  }
}
