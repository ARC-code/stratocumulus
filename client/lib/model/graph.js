const config = require('../config')
const normalize_size = require('../normalize_size')

const kind_color_map = config.kind_color_map
const default_color = config.default_color

exports.update = function (graph, subgraph) {
  // Update the graph object with a subgraph received from the server.
  //
  // Parameters:
  //   graph
  //     a graph to update. Will be modified.
  //   subgraph
  //     object, received from the server, has optional properties:
  //       nodes
  //         optional array of node objects
  //       edges
  //         optional array of edge objects
  //
  if (subgraph.hasOwnProperty('nodes')) {
    subgraph.nodes.map(n => {
      let attrs = { 'label': n.label, x: 1, y: 1 };

      if (n.hasOwnProperty('kind') && n.kind in kind_color_map) {
          attrs['color'] = kind_color_map[n.kind];
      } else {
          attrs['color'] = default_color;
      }

      if (n.hasOwnProperty('value')) attrs['size'] = normalize_size(n.value);
      if (n.hasOwnProperty('fixed')) attrs['fixed'] = n.fixed;
      if (n.hasOwnProperty('parent')) attrs['parent'] = n.parent;

      graph.addNode(n.id, attrs);
    });
  }

  if (subgraph.hasOwnProperty('edges')) {
    subgraph.edges.map(e => graph.addEdge(e.from, e.to));
  }
}
