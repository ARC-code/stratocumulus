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

  // Determine if it is a stratum or a data plane.
  // Either: stratum_graph, data_plane
  let structureKind = graph.getAttribute('structure')

  if (!structureKind) {
    // This is probably the first subgraph.
    // Record the structure kind, if one available.
    if (subgraph.structure) {
      graph.setAttribute('structure', subgraph.structure)
      structureKind = subgraph.structure
    } else {
      console.warn('Invalid subgraph:', subgraph)
      throw new Error('Unexpected missing subgraph structure property')
    }
  } else {
    if (subgraph.structure && subgraph.structure !== structureKind) {
      // Update to data_plane
      graph.setAttribute('structure', subgraph.structure)
      structureKind = subgraph.structure
    }
  }

  if (structureKind === 'stratum_graph') {
    if ('nodes' in subgraph) {
      subgraph.nodes.forEach(n => {
        const nodeKey = n.id
        if (graph.hasNode(nodeKey)) {
          // Update existing node.
          // Server might send same node multiple times with additional data.
          graph.updateNodeAttributes(nodeKey, attrs => {
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
            id: nodeKey,
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
          graph.addNode(nodeKey, newNodeAttrs)
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
  } else if (structureKind === 'data_plane') {
    if ('nodes' in subgraph) {
      subgraph.nodes.forEach(n => {
        // Include only card artifacts.
        if (n.kind && n.kind === 'artifact') {
          const nodeKey = n.id
          if (graph.hasNode(nodeKey)) {
            // Update existing card node.
            // Server might send same node multiple times with additional data.
            graph.updateNodeAttributes(nodeKey, attrs => {
              const nextNodeAttrs = mergeNodeAttributes(attrs, n)
              if (attrs.stale) {
                // If node was stale, it indicates ongoing filtering
                // and that the node is filtered in and is not stale anymore.
                nextNodeAttrs.stale = false
              }
              return nextNodeAttrs
            })
          } else {
            // Construct a new card node
            const newNodeAttrs = mergeNodeAttributes({
              // Default values.
              id: nodeKey,
              label: n.label,
              kind: 'grouping',
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
            // Use some made-up value for cards
            newNodeAttrs.value = 100
            graph.addNode(nodeKey, newNodeAttrs)
          }
        }
      })
    }
  }
}
