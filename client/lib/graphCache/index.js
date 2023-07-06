// HACK This is a temporary hack to store Graphology graphs of
// loaded but removed strata.

// Store graphs here. Structure:
// stratumPath e.g. "/arc/federations/5f623f9b52023c009d731553"
// -> a graphology Graph
const graphs = {}

exports.store = (path, graph) => {
  // Store a graph
  //

  graphs[path] = graph
}

exports.read = (path) => {
  // Read a stored graph. If graph does not exist, return null.
  //
  // Return
  //   a graphology Graph or null
  //
  const graph = graphs[path]
  if (graph) {
    return graph
  }
  return null
}
