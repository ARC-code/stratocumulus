/* global panzoom */
const stratumLib = require('./stratum');
const tapspace = require('tapspace');

exports.build = function () {
  // State - the global context.
  // Our application state in a single object.
  const state = {
    strata: {},
    strata_trail: [],
    current_stratum: 0,
    graph_timers: {}
  };

  // Setup sky
  // const sky = document.getElementById('sky');
  // sky.style.backgroundColor = bg_color;

  // Setup tapspace
  const space = tapspace.create('#sky');
  const view = space.getViewport();
  const origin = space.createPlane();

  // TODO build more than single stratum
  const stratum = stratumLib.build_stratum('/', {}, 'ARC', '#444444', space);

  // Track what strata we have built.
  state.strata['/'] = stratum;
  state.strata_trail.push(stratum.path);
  state.current_stratum = state.strata_trail.length - 1;

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

  return state;
};
