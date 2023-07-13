const LabelStore = function () {
  // @LabelStore
  //
  // This is a way to collect labels for faceted context labels.
  //

  // Store labels here. Structure:
  // kind string e.g. "f_genres.id"
  // -> facet id e.g. "5f6243ff52023c009d735400"
  // -> label string, e.g. "Citation"
  this.labels = {}
}

module.exports = LabelStore
const proto = LabelStore.prototype

// Methods
proto.read = require('./read')
proto.write = require('./write')
