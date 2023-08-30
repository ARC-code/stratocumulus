module.exports = function (kind, id, label) {
  // @LabelStore:write(kind, id, label)
  //
  // Store a label.
  //

  if (!this.labels[kind]) {
    this.labels[kind] = {}
  }

  this.labels[kind][id] = label
}
