module.exports = function (kind, id) {
  // @LabelStore:read(kind, id)
  //
  // Read a stored label. If label does not exist, return null.
  //
  if (this.labels[kind]) {
    const label = this.labels[kind][id]
    if (label) {
      return label
    }
  }
  return null
}
