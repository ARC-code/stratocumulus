// Stratum methods and functions.
//
// Architectural note:
// Single stratum does not know about other strata.
// This way we maintain modularity and can manage inter-stratum connections
// on higher abstraction level, adapting the Mediator/Manager patterns.
//

exports.build = require('./build')
exports.refresh = require('./refresh')
exports.remove = require('./remove')
