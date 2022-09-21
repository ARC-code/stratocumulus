/* global $ */
const node_color_css = require('./node_color_css');
const config = require('../../config');
const tapspace = require('tapspace');

const min_node_size = config.sizing.min_node_size;

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
  const div_id = stratum.id
  const path = stratum.path
  const div = stratum.div;

  graph.forEachNode(function (key, attrs) {
    const n_id = key.replaceAll('/', '_');
    const n_latch = $(`#${n_id}-latch`);
    const n_label = $(`#${n_id}-label`);
    const n = $(`#${n_id}`);

    const ww = window.innerWidth;
    const wh = window.innerHeight;

    let size = min_node_size;
    if ('size' in attrs) size = attrs.size;

    const n_x = attrs.x + ((ww / 2) - (size / 2));
    const n_y = attrs.y + ((wh / 2) - (size / 2));
    const latch_style_specs = `top: ${attrs.y + (wh / 2)}px; left: ${attrs.x + (ww / 2)}px;`;
    const label_style_specs = latch_style_specs + ` font-size: ${size / 3}px; margin-top: -${(size / 3) / 2}px`;
    const node_style_specs = `top: ${n_y}px; left: ${n_x}px; height: ${size}px; width: ${size}px; ${node_color_css(attrs.color)}`;

    let data_attrs = '';
    for (const a in attrs) {
      data_attrs += ` data-${a}="${attrs[a]}"`;
    }

    if (!n.length) {
      // Create node elements
      div.append(`
        <div id="${n_id}-latch" class="latch" style="${latch_style_specs}"></div>
        <div id="${n_id}" class="node" style="${node_style_specs}"${data_attrs}></div>
        <span id="${n_id}-label" class="label" style="${label_style_specs}">${attrs.label}</span>
      `);
    } else {
      // Update node elements
      n_latch.attr('style', latch_style_specs);
      n_label.attr('style', label_style_specs);
      n.attr('style', node_style_specs);
    }
  });

  if (final) {
    graph.forEachEdge(function (edge_key, edge_attrs, source_key, target_key) {
      const source_id = source_key.replaceAll('/', '_');
      const target_id = target_key.replaceAll('/', '_');
      $(`#${source_id}-latch, #${target_id}-latch`).connections({
        within: '#sky',
        class: 'edge'
      });
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
