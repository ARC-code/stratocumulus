// @io
//
// Stratocumulus client-side IO.
//
// Gather here all code that handles sending and receiving data from
// servers and databases. This helps a lot when migrating to new or
// updated backend APIs.
//

const GraphStore = require('./GraphStore')
const LabelStore = require('./LabelStore')

exports.corpora = require('./corpora')
exports.stream = require('./stream')

exports.labelStore = new LabelStore()
exports.graphStore = new GraphStore(exports.labelStore)
