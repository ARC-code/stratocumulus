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
  const sky = document.querySelector('#sky');
  const space = tapspace.create(sky, {
    size: { // TODO set in css
      width: '100%',
      height: '100%'
    }
  });
  const view = space.getViewport();

  // TODO build more than single stratum
  const stratum = stratumLib.build_stratum('/', {}, 'ARC', '#444444', space);

  // Track what strata we have built.
  state.strata['/'] = stratum;
  state.strata_trail.push(stratum.path);
  state.current_stratum = state.strata_trail.length - 1;

  // Center viewport to stratum.
  stratum.div.affine.translateTo(view.atCenter());

  stratum.once('final', () => {
    // DEBUG show final in console
    console.log('stratum ' + stratum.path + ' event: final');

    // Make viewport zoomable after rendered
    view.pannable().zoomable();

    // Hide labels after zoom
    // let zoom_timer = null;
    // zoomer.on('transform', function (e) {
    //   clearTimeout(zoom_timer);
    //   zoom_timer = setTimeout(() => {
    //     stratumLib.semantic_zoom(stratum);
    //   }, 1000);
    // });

    // Fit view to the network
    // TODO

    // Take a snapshot
    // TODO

    // Add snapshot to minimap
    // TODO minimap.draw_minimap()
  });

  return state;
};
