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
