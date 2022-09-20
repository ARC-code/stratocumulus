const node_color_css = require('./node_color_css')
const config = require('../../config')

const min_node_size = config.sizing.min_node_size

exports.draw_graph = function (path, graph, final=false) {
  // Render the graph. If elements already exist, update.
  //
  // Parameters:
  //   path
  //     a string. The identity of the graph. We use it to construct elem ids.
  //   graph
  //     a graphology graph object
  //   final
  //     boolean, set true to update edges
  //
  let div_id = path.replaceAll('/', 'X');
  let div = $(`#${div_id}`);

  graph.forEachNode(function(key, attrs) {
    let n_id = key.replaceAll('/', '_');
    let n_latch = $(`#${n_id}-latch`);
    let n_label = $(`#${n_id}-label`);
    let n = $(`#${n_id}`);

    let size = min_node_size;
    const ww = window.innerWidth
    const wh = window.innerHeight
    if (attrs.hasOwnProperty('size')) size = attrs.size;
    let n_x = attrs.x + ( (ww / 2) - (size / 2) );
    let n_y = attrs.y + ( (wh / 2) - (size / 2) );
    let latch_style_specs = `top: ${attrs.y + (wh / 2)}px; left: ${attrs.x + (ww / 2)}px;`;
    let label_style_specs = latch_style_specs + ` font-size: ${size / 3}px; margin-top: -${(size / 3) / 2}px`;
    let node_style_specs = `top: ${n_y}px; left: ${n_x}px; height: ${size}px; width: ${size}px; ${node_color_css(attrs.color)}`;

    let data_attrs = "";
    for (let a in attrs) {
      data_attrs += ` data-${a}="${attrs[a]}"`
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
      let source_id = source_key.replaceAll('/', '_');
      let target_id = target_key.replaceAll('/', '_');
      $(`#${source_id}-latch, #${target_id}-latch`).connections({within: '#sky', class: 'edge'});
    });
  }
}

exports.semantic_zoom = function () {
  // Show/hide labels depending node size
  //
  $('.node').each(function() {
    let node = $(this);
    let label = $(`#${node[0].id}-label`);
    let rect = node[0].getBoundingClientRect();
    if (rect.width >= 20) {
      label.show();
    } else {
      label.hide();
    }
  });
}
