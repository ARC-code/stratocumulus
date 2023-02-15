// Stratum methods and functions.
//
// Architectural note:
// Single stratum does not know about other strata.
// This way we maintain modularity and can manage inter-stratum connections
// on higher abstraction level, adapting the Mediator/Manager patterns.
//

exports.buildStratum = require('./build')
exports.refresh = require('./refresh')
exports.removeStratum = require('./remove')
