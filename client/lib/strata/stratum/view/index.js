/* global $ */
const node_template = require('./node_template');
const node_size = require('./node_size');
const tapspace = require('tapspace');

exports.create_network_div = function (space, id) {
  // Create container for the stratum
  //
  // Parameters:
  //   space
  //     a Tapspace space into which to add the network div.
  //   id
  //     string, a valid html id for the network div.
  //
  // Return
  //   a HTMLElement with affine perk
  //

  // Space plane for content. Adds the plane to the space.
  const network_plane = space.createPlane();

  // Set element attributes so we can refer to the element.
  const network_div = network_plane.getElement();
  network_div.id = id;
  network_div.className = 'network';

  // Create groups for nodes and edges
  const node_group = new tapspace.components.Group();
  const edge_group = new tapspace.components.Group();

  // Add edge group first so they will be drawn first.
  network_plane.add(edge_group);
  network_plane.add(node_group);

  // A sketchy way to refer to the groups later. TODO improve.
  network_plane.edge_group = edge_group;
  network_plane.node_group = node_group;

  // network_div.scrollIntoView(); // TODO is necessary?

  return network_div;
};

exports.draw_graph = function (stratum, final = false) {
  // Render the graph. If elements already exist, update.
  //
  // Parameters:
  //   stratum
  //     a stratum object with 'path', 'div', and 'graph' properties
  //   final
  //     boolean, set true to update edges
  //
  const div = stratum.div;
  const plane = div.affine;
  const path = stratum.path;
  const graph = stratum.graph;

  const edge_group = plane.edge_group;
  const node_group = plane.node_group;

  graph.forEachNode(function (key, attrs) {
    // Prefixing node ids with path to prevent id collisions across strata
    const n_id = `${path}${key}`.replaceAll('/', '_');
    const n_el = document.getElementById(n_id);

    const n_x = attrs.x;
    const n_y = attrs.y;
    const size_margin = 4;
    const n_size = node_size(attrs) + size_margin;

    if (n_el) {
      // Node exists. Update position.
      n_el.affine.translateTo(plane.at(n_x, n_y));
      // Update also size.
      n_el.affine.setSize({
        width: n_size,
        height: n_size
      });
    } else {
      // No such node yet. Create.
      const new_el = node_template(n_id, attrs);
      const new_item = tapspace.element(new_el, {
        id: n_id,
        size: {
          width: n_size,
          height: n_size
        },
        anchor: {
          x: n_size / 2,
          y: n_size / 2
        }
      });
      node_group.addChild(new_item, plane.at(n_x, n_y));
    }
  });

  if (final) {
    // Draw edges
    graph.forEachEdge(function (edge_key, edge_attrs, source_key, target_key) {
      // Prefixing all ids with path to prevent id collisions across strata
      const source_id = `${path}${source_key}`.replaceAll('/', '_');
      const target_id = `${path}${target_key}`.replaceAll('/', '_');
      const edge_id = `${path}${edge_key}`.replaceAll('/', '_');

      const edge_el = document.getElementById(edge_id);

      let edge_item;
      if (edge_el) {
        // Edge exists.
        edge_item = edge_el.affine;
      } else {
        // No such edge yet. Create.
        edge_item = tapspace.edge('white', {
          id: edge_id,
          className: 'edge'
        });
        edge_group.addChild(edge_item);
      }

      // Move edge to position. We need the nodes.
      const source_el = document.getElementById(source_id);
      const target_el = document.getElementById(target_id);

      // Ensure both exists and are affine
      if (source_el && target_el) {
        if (source_el.affine && target_el.affine) {
          // Edge endpoints are valid tapspace elements.
          edge_item.setPoints(
            source_el.affine.atAnchor(),
            target_el.affine.atAnchor()
          );
        } else {
          console.error('Tried to create edge between non-tapspace elements.');
        }
      } else {
        console.warn('Tried to create edge between non-existent elements.');
      }
    });

    // Add click event for facetable nodes
    const facetable_nodes = document.querySelectorAll('.node[data-facet_param]');
    const facetable_click_handler = (event) => {
      let facet_param = event.target.getAttribute('data-facet_param');
      let facet_value = event.target.getAttribute('data-facet_value');
      let context = {}
      context[`f_${facet_param}`] = facet_value;
      console.log(`To create the newly faceted stratum, I'm assuming we'd call "build_stratum" with the following params:
  path: "${event.target.id.replaceAll('_', '/')}"
  context: ${context}
  label: "to be determined"
  bg_color: "to be determined"
  space: ?  
      `);
    };
    facetable_nodes.forEach(facetable_node => {
      facetable_node.removeEventListener('click', facetable_click_handler);
      facetable_node.addEventListener('click', facetable_click_handler);
    });
  }

  // strata[path].network = new vis.Network(strata[path].div, strata[path].data, graph_options);
  // strata[path].network.on("click", function(params) {
  //     if (params.nodes.length > 0) {
  //         let clicked_uri = params.nodes[0];
  //         let node = strata[path].data.nodes.get(clicked_uri);
  //         if (node.hasOwnProperty('kind')) {
  //             console.log(clicked_uri);
  //             let obj_id_regex = new RegExp("([^/]*)$", "gm");
  //             let obj_id_match = obj_id_regex.exec(clicked_uri);
  //             let obj_id = obj_id_match[1];
  //             let new_context = Object.assign({}, strata[path].context);
  //             new_context[f_{node.kind}.id] = obj_id;
  //             build_stratum(clicked_uri, new_context, node.label, node.color);
  //         }
  //     }
  // });
};

exports.refresh_labels = function (stratum, space) {
  // Show/hide labels depending on visible node size.
  //
  // Parameters:
  //   stratum
  //     a stratum object
  //   space
  //     a tapspace space, required for finding node size relative to viewport.
  //
  const stratum_plane = stratum.div.affine;
  const nodes = stratum_plane.node_group.getChildren(); // HACKY

  nodes.forEach((node) => {
    // Determine node size on viewport.
    const size = node.getWidth(); // a Distance on node
    const sizeOnViewport = size.changeBasis(space).d;

    // Show if large enough, ensure hidden otherwise.
    const label = node.getElement().querySelector('.label');
    // Check that label exists.
    if (label) {
      if (sizeOnViewport >= 20) {
        label.style.display = 'inline';
      } else {
        label.style.display = 'none';
      }
    }
  });
};
