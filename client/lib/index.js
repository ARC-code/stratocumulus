const io = require('./io')
const model = require('./model')
const view = require('./view')

let strata = {};
let strata_trail = [];
let global_context = {};
let current_stratum = 0;

let zoomer = null;
let zoom_timer = null;

let graph_timers = {};

exports.start = function () {
  // DEBUG message to help dev to differentiate between:
  // - app bundle is ok but we are offline (ok message, no UI action)
  // - app bundle is broken (no message, no UI action)
  console.log('Stratocumulus client started.')

  // Open SSE stream
  io.stream.connect()

  // Init first stratum
  build_stratum('/', {}, 'ARC', "#444444");
};

function build_stratum(path, context, label, bg_color) {
  if (strata.hasOwnProperty(path)) {
    // Stratum already exists. No need to rebuild.
    return
  }

  // Create container for the stratum
  let div_id = path.replaceAll('/', 'X');
  let network_div = document.createElement('div');
  network_div.id = div_id;
  network_div.className = "network";

  // Append to container
  const sky = document.querySelector('#sky');
  //sky.style.backgroundColor = bg_color;
  sky.appendChild(network_div);

  network_div.scrollIntoView();

  // Create stratum object
  strata[path] = {
    div: document.getElementById(div_id),
    graph: model.graph.create(),
    layout: null,
    label: label,
    image_src: null,
    bg_color: bg_color,
    context: Object.assign({}, context)
  };

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

  // Begin listen events for the path.
  io.stream.on(path, function (subgraph) {
    // Insert the subgraph received from the server.
    if (strata[path]) {
      const graph = strata[path].graph
      model.graph.update(graph, subgraph)

      // Refresh the layout
      model.graph.perform_layout(graph);
      // Render the graph
      view.graph.draw_graph(path, graph);

      // Try to perform final layout after a moment
      if (graph_timers[path]) {
        clearTimeout(graph_timers[path]);
      }
      graph_timers[path] = setTimeout(() => {
        fit_network(path)
      }, 3000);
    }
  });

  // Inform the server we are ready to receive the stratum.
  io.stream.sendStratumBuildJob(path, context)

  // Track what strata we have built.
  strata_trail.push(path);
  current_stratum = strata_trail.length - 1;
}

function fit_network(path) {
  if (strata.hasOwnProperty(path)) {
    setTimeout(take_network_snapshot.bind(this, path), 1000);
  }
}

function take_network_snapshot(path) {
  if (strata.hasOwnProperty(path)) {
    const graph = strata[path].graph
    model.graph.perform_layout(graph, true);
    view.graph.draw_graph(path, graph, true);

    // Make zoomable after rendered
    const sky = document.querySelector('#sky');
    zoomer = panzoom(sky);

    // Hide labels after zoom
    zoomer.on('transform', function (e) {
      clearTimeout(zoom_timer);
      zoom_timer = setTimeout(view.graph.semantic_zoom, 1000);
    });
  }

  // view.minimap.draw_minimap()
}
