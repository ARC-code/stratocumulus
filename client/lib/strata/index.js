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

  return state
};
