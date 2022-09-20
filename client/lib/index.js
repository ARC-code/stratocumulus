const io = require('./io')
const strata = require('./strata')

exports.start = function () {
  // DEBUG message to help dev to differentiate between:
  // - app bundle is ok but we are offline (ok message, no UI action)
  // - app bundle is broken (no message, no UI action)
  console.log('Stratocumulus client started.');

  // Open SSE stream
  io.stream.connect();

  // Init first stratum
  strata.build()
};
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
