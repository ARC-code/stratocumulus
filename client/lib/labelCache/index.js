// HACK This is a temporary hack to collect labels for faceted context labels.

// Store labels here. Structure:
// kind string e.g. "f_genres.id"
// -> facet id e.g. "5f6243ff52023c009d735400"
// -> label string, e.g. "Citation"
const labels = {}

exports.store = (kind, id, label) => {
  // Store a label
  //

  if (!labels[kind]) {
    labels[kind] = {}
  }

  labels[kind][id] = label
}

exports.read = (kind, id) => {
  // Read a stored label. If label does not exist, return null.
  //
  if (labels[kind]) {
    const label = labels[kind][id]
    if (label) {
      return label
    }
  }
  return null
}
