const graphology = require('graphology');
const graphologyLayout = require('graphology-layout');
// const graphologyForce = require('graphology-layout-force');
// const graphologyNoverlap = require('graphology-layout-noverlap');

const config = require('../../config');
const normalize_size = require('./normalize_size');

const kind_color_map = config.kind_color_map;
const default_color = config.default_color;

exports.create_graph = function () {
  // Create a new graph
  return new graphology.Graph();
};

exports.update_graph = function (graph, subgraph) {
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
  if ('nodes' in subgraph) {
    subgraph.nodes.forEach(n => {
      const attrs = { label: n.label, x: 1, y: 1 };

      if ('kind' in n && n.kind in kind_color_map) {
        attrs.color = kind_color_map[n.kind];
      } else {
        attrs.color = default_color;
      }

      if ('value' in n) attrs.size = normalize_size(n.value);
      if ('fixed' in n) attrs.fixed = n.fixed;
      if ('parent' in n) attrs.parent = n.parent;

      graph.addNode(n.id, attrs);
    });
  }

  if ('edges' in subgraph) {
    subgraph.edges.forEach(e => graph.addEdge(e.from, e.to));
  }
};

exports.perform_layout = function (graph, final = false) {
  // Apply layout to a graph.
  //
  // Parameters
  //   graph
  //     a graphology graph object. Will be modified.
  //

  if (!final) {
    graphologyLayout.circlepack.assign(graph, {
      hierarchyAttributes: ['parent'],
      center: 0,
      scale: 1.1
    });
  }

  if (final) {
    const rotations = {};
    let rotation_degree = 0;
    let zero_outliers_found = false;

    while (rotation_degree <= 340) {
      const node_coords = graph.mapNodes((node_id, node_attrs) => {
        const x = node_attrs.x + (window.innerWidth / 2);
        const y = node_attrs.y + (window.innerHeight / 2);
        return [x, y];
      });

      // Find if some nodes are outside viewport
      let outliers = 0;
      const w = window.innerWidth;
      const h = window.innerHeight;
      for (const coord of node_coords) {
        if (coord[0] < 0 || coord[0] > w || coord[1] < 0 || coord[1] > h) {
          outliers += 1;
        }
      }
      rotations[outliers] = rotation_degree;

      if (rotation_degree > 0 || rotation_degree < 340) {
        const opts = { degrees: true, centeredOnZero: true };
        graphologyLayout.rotation.assign(graph, rotation_degree, opts);
      }

      if (outliers === 0) {
        zero_outliers_found = true;
        break;
      } else {
        rotation_degree += 20;
      }
    }

    // If outliers were found, apply the rotation with least outliers
    if (!zero_outliers_found) {
      const fewest_outliers = Math.min(...Object.keys(rotations));
      const best_rotation = rotations[fewest_outliers];
      const degrees_to_rotate = best_rotation + (360 - rotation_degree);

      const opts = { degrees: true };
      graphologyLayout.rotation.assign(graph, degrees_to_rotate, opts);
    }
  }
};
