const normalizeSize = require('./normalizeSize')

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
        const nodeAttrs = graph.getNodeAttributes(n.id)

        if (nodeAttrs.stale) {
          // Duplicate because filtered. Means that node is filtered in.
          graph.updateNodeAttributes(n.id, attrs => {
            const nextAttrs = { ...attrs, stale: false }
            if ('value' in n) {
              nextAttrs.value = n.value
              nextAttrs.size = normalizeSize(n.value)
            }
            if ('decades' in n) {
              nextAttrs.decades = n.decades
            }
            return nextAttrs
          })
          // Node updated.
          return
        }

        // Else notify duplicate node
        console.warn(`Duplicate for node ${n.id} detected.`) // DEBUG
        return
      }

      const attrs = {
        id: n.id,
        label: n.label,
        value: 0,
        decades: {},
        size: 0,
        fixed: false,
        parent: null,
        isFacetable: false,
        facetParam: null,
        facetValue: null,
        stale: false // for cache invalidation during filtering
      }

      if ('kind' in n && n.kind.length > 0) {
        attrs.kind = n.kind
      }
      if ('value' in n) {
        attrs.value = n.value
        attrs.size = normalizeSize(n.value)
      }
      if ('decades' in n) attrs.decades = n.decades
      if ('fixed' in n) attrs.fixed = n.fixed
      if ('parent' in n) attrs.parent = n.parent
      if ('is_facetable' in n) attrs.isFacetable = n.is_facetable
      if ('facet_param' in n) attrs.facetParam = n.facet_param
      if ('facet_value' in n) attrs.facetValue = n.facet_value

      graph.addNode(n.id, attrs)
    })
  }

  if ('edges' in subgraph) {
    subgraph.edges.forEach(edge => {
      if (graph.hasEdge(edge.from, edge.to)) {
        // Mark cached edge as fresh.
        graph.updateEdgeAttribute(edge.from, edge.to, 'stale', () => false)
      } else {
        graph.addEdge(edge.from, edge.to, {
          stale: false // for cache invalidation during filtering
        })
      }
    })
  }
}
