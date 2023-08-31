const graphology = require('graphology')
const addNode = require('./model/addNode')

module.exports = function (context, nodeAttrs) {
  // @GraphStore:provide(context, nodeAttrs)
  //
  // Provide the graph a single node.
  // This does not make the graph completed.
  // Useful to initiate the graph with a single node.
  // If the node already exists, do nothing.
  //

  const key = context.toCacheKey()

  let graph = this.graphs[key]

  if (!graph) {
    graph = new graphology.Graph()
    this.graphs[key] = graph
  }

  addNode(graph, nodeAttrs)
}
