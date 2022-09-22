/* global $ */
const node_template = require('./node_template');
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
  const graph = stratum.graph;

  graph.forEachNode(function (key, attrs) {
    const n_id = key.replaceAll('/', '_');
    const n_el = document.getElementById(n_id);

    const n_x = attrs.x;
    const n_y = attrs.y;

    if (n_el) {
      // Node exists. Update position.
      n_el.affine.translateTo(plane.at(n_x, n_y));
    } else {
      // No such node yet. Create.
      const new_el = node_template(n_id, attrs);
      const new_item = tapspace.element(new_el);
      plane.add(new_item, plane.at(n_x, n_y));
    }
  });

  if (final) {
    // Draw edges
    graph.forEachEdge(function (edge_key, edge_attrs, source_key, target_key) {
      const source_id = source_key.replaceAll('/', '_');
      const target_id = target_key.replaceAll('/', '_');
      const edge_id = edge_key.replaceAll('/', '_');

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
        plane.add(edge_item);
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

exports.refresh_labels = function (stratum) {
  // Show/hide labels depending node size
  //
  $(stratum.div).find('.node').each(function () {
    const node = $(this);
    const label = $(`#${node[0].id}-label`);
    const rect = node[0].getBoundingClientRect();
    if (rect.width >= 20) {
      label.show();
    } else {
      label.hide();
    }
  });
};
