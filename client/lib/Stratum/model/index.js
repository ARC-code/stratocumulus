// Stratum graph model.
//
// Functions for working with the graphology Graph.
// The model is responsible of the stratum structure
// but does not deal with the layout or appearance of the graph.
//

exports.createGraph = require('./createGraph')
exports.findNodeByContext = require('./findNodeByContext')
exports.freezeLayout = require('./freezeLayout')
exports.getCardinality = require('./getCardinality')
exports.pruneStale = require('./pruneStale')
exports.staleAll = require('./staleAll')
exports.unfreezeLayout = require('./unfreezeLayout')
exports.updateGraph = require('./updateGraph')
