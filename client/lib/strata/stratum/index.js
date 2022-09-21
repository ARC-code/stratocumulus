const model = require('./model');
const view = require('./view');
const emitter = require('component-emitter');
const io = require('../../io');

exports.build_stratum = function (path, context, label, bg_color) {
  // Create container for the stratum
  const div_id = path.replaceAll('/', 'X');
  const network_div = document.createElement('div');
  network_div.id = div_id;
  network_div.className = 'network';

  // Append to container
  const sky = document.getElementById('sky');
  // sky.style.backgroundColor = bg_color;
  sky.appendChild(network_div);

  network_div.scrollIntoView();

  // Create stratum object
  const stratum = {
    path: path,
    div: document.getElementById(div_id),
    graph: model.create_graph(),
    layout: null,
    label: label,
    image_src: null,
    bg_color: bg_color,
    context: Object.assign({}, context),
    alive: true
  };

  // Give stratum object emitter methods: on, off, emit
  emitter(stratum);

  // Begin listen events for the path.
  let graph_timer = null;
  io.stream.on(path, function (subgraph) {
    // Insert the subgraph received from the server.
    if (stratum.alive) {
      model.update_graph(stratum.graph, subgraph);

      // Refresh the layout
      model.perform_layout(stratum.graph);
      // Render the graph
      view.draw_graph(path, stratum.graph);

      // Try to perform final layout after a moment
      if (graph_timer) {
        clearTimeout(graph_timer);
      }
      graph_timer = setTimeout(() => {
        model.perform_layout(stratum.graph, true);
        view.draw_graph(path, stratum.graph, true);
        stratum.emit('final');
      }, 3000);
    }
  });

  // Inform the server we are ready to receive the stratum.
  io.stream.sendStratumBuildJob(path, context);

  return stratum;
};

exports.semantic_zoom = (stratum) => {
  if (stratum.alive) {
    view.refresh_labels(stratum);
  }
};
