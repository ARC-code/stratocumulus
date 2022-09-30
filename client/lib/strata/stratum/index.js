const model = require('./model');
const view = require('./view');
const emitter = require('component-emitter');
const io = require('../../io');

exports.build_stratum = function (path, context, label, bg_color, space) {
  // Parameters:
  //   path
  //     string, the stratum id
  //   context
  //     object
  //   label
  //     string
  //   bg_color
  //     string, css color
  //   space
  //     a tapspace space on which to draw the graph

  // Build valid html-friendly id
  const div_id = path.replaceAll('/', 'X');
  // Create container for the stratum
  const network_div = view.create_network_div(space, div_id);

  // Create stratum object
  const stratum = {
    id: div_id,
    path: path,
    div: network_div,
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
  io.stream.on(path, function (subgraph) {
    // Insert the subgraph received from the server.
    if (stratum.alive) {
      model.update_graph(stratum.graph, subgraph);

      // Determine if final message for graph
      let is_final = (subgraph.hasOwnProperty('stage') && subgraph.stage === 'final')

      // Refresh the layout
      model.perform_layout(stratum.graph, is_final);
      // Render the graph
      view.draw_graph(stratum, is_final);

      // Emit 'final' event if last message
      if (is_final) stratum.emit('final');
    }
  });

  // Inform the server we are ready to receive the stratum.
  io.stream.sendStratumBuildJob(path, context);

  return stratum;
};

exports.semantic_zoom = (stratum, space) => {
  if (stratum.alive) {
    view.refresh_labels(stratum, space);
  }
};
