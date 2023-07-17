const graphology = require('graphology')
const addNode = require('./model/addNode')

module.exports = function (context, nodeAttrs) {
  // Provide the graph a single node.
  // Useful to initiate the graph with a single node.
  // If the node already exists, do nothing.
  //

  const path = context.toFacetPath()

  let graph = this.graphs[path]

  if (!graph) {
    graph = new graphology.Graph()
    this.graphs[path] = graph
  }

  addNode(graph, nodeAttrs)
}
