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

  // Once the first stratum is rendered...
  stratum.once('final', () => {
    // DEBUG show final in console
    console.log('stratum ' + stratum.path + ' event: final');

    // TODO Fit view to the network
    // const stratum_plane = stratum.div.affine;
    // stratum_plane.scaleToFit(view);

    // Make viewport zoomable after rendered
    view.pannable().zoomable();

    // Show/hide labels after zoom
    stratumLib.semantic_zoom(stratum, space);
    // TODO view.on('idle', () => { ... })
    let zoom_timer = null;
    view.capturer('wheel').on('wheel', () => {
      clearTimeout(zoom_timer);
      zoom_timer = setTimeout(() => {
        stratumLib.semantic_zoom(stratum, space);
      }, 500);
    });

    // Take a snapshot
    // TODO

    // Add snapshot to minimap
    // TODO minimap.draw_minimap()
  });

  return state;
};
