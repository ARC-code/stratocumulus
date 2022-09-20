const minimap = require('./minimap');
const stratumLib = require('./stratum');

exports.build = function () {
  // State - the global context.
  // Our application state in a single object.
  const state = {
    strata: {},
    strata_trail: [],
    current_stratum: 0,
    graph_timers: {}
  };

  // TODO build more than single stratum
  const stratum = stratumLib.build_stratum('/', {}, 'ARC', "#444444");

  // Track what strata we have built.
  state.strata['/'] = stratum;
  state.strata_trail.push(stratum.path);
  state.current_stratum = strata_trail.length - 1;

  stratum.once('final', () => {
    // Make zoomable after rendered
    const sky = document.querySelector('#sky');
    const zoomer = panzoom(sky);

    // Hide labels after zoom
    let zoom_timer = null;
    zoomer.on('transform', function (e) {
      clearTimeout(zoom_timer);
      zoom_timer = setTimeout(() => {
        stratumLib.semantic_zoom(stratum);
      }, 1000);
    });

    // Fit view to the network
    // TODO

    // Take a snapshot
    // TODO

    // Add snapshot to minimap
    // TODO minimap.draw_minimap()
  });

  return state
};
