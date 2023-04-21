const mergeNodeAttributes = require('./mergeNodeAttributes')

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
  //           decades
  //             an object, decade -> integer
  //           fixed
  //           parent
  //           facet_param
  //           facet_value
  //       edges
  //         optional array of edge objects
  //
  if ('nodes' in subgraph) {
    subgraph.nodes.forEach(n => {
      if (graph.hasNode(n.id)) {
        // Update existing node.
        // Server might send same node multiple times with additional data.
        graph.updateNodeAttributes(n.id, attrs => {
          const nextNodeAttrs = mergeNodeAttributes(attrs, n)
          if (attrs.stale) {
            // If node was stale, it indicates ongoing filtering
            // and that the node is filtered in and is not stale anymore.
            nextNodeAttrs.stale = false
          }
          return nextNodeAttrs
        })
      } else {
        // Construct a new node
        const newNodeAttrs = mergeNodeAttributes({
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
        }, n)
        graph.addNode(n.id, newNodeAttrs)
      }
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
