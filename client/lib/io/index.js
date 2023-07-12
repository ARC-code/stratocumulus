// Stratocumulus client-side IO.
//
// Gather here all code that handles sending and receiving data from
// servers and databases. This helps a lot when migrating to new or
// updated backend APIs.
//

const GraphStore = require('./GraphStore')

exports.corpora = require('./corpora')
exports.stream = require('./stream')
exports.graphStore = new GraphStore()
