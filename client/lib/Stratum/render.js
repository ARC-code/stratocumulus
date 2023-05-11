const tapspace = require('tapspace')
const layoutGraph = require('./layout')
const StratumNode = require('../StratumNode')
const ArtifactCard = require('../ArtifactCard')

module.exports = function (final = false) {
  // Render the graph. If elements already exist, update.
  // This method is idempotent, thus you can call this method multiple times
  // for example once for every new substratum from the server.
  //
  // Parameters:
  //   final
  //     boolean, set true to update edges
  //
  const stratumOrigin = this.space.at(0, 0)
  // const path = this.path
  // const graph = this.graph

  // const edgeGroup = stratumSpace.edgeGroup
  // const nodeGroup = stratumSpace.nodeGroup

  const layoutPositions = layoutGraph(this.graph, this.context)

  // Map each node in graph model to a visible tapspace item.
  this.graph.forEachNode((key, attrs) => {
    let stratumNode = this.renderedNodes[key]

    if (!stratumNode) {
      // Node does not exist. Create.

      const isDataCard = (attrs.kind && attrs.kind === 'artifact')
      if (isDataCard) {
        // console.log('DataCard detected')
        // console.log(key, attrs)
        stratumNode = new ArtifactCard(key, attrs, this.nodePlane)
      } else {
        stratumNode = new StratumNode(key, attrs, this.nodePlane)
      }

      this.renderedNodes[key] = stratumNode
    }

    // Update position according to the layout.
    const nPosition = layoutPositions[key]
    const nPoint = stratumOrigin.offset(nPosition.x, nPosition.y)
    stratumNode.translateTo(nPoint)
    // Update size and scale according to attributes.
    stratumNode.updateCount(attrs)
  })

  if (final) {
    // Re-compute bounding circle
    // TODO also do a couple of times before final.
    this.boundingCircle = this.nodePlane.getBoundingSphere()
    // Enable faceting
    this.enableFaceting()
    // Display context label
    this.renderContextLabel()
    // Draw edges
    this.graph.forEachEdge((edgeKey, edgeAttrs, sourceKey, targetKey) => {
      let edgeItem = this.renderedEdges[edgeKey]

      if (!edgeItem) {
        // No such edge yet rendered. Create
        edgeItem = tapspace.createEdge('gray')
        edgeItem.addClass('edge')
        edgeItem.edgeKey = edgeKey
        // or model.edgeKey
        // and consider sourceKey, targetKey
        this.renderedEdges[edgeKey] = edgeItem
        this.edgePlane.addChild(edgeItem)
      }

      // Move edge to position. We need the nodes.
      const sourceNode = this.renderedNodes[sourceKey]
      const targetNode = this.renderedNodes[targetKey]

      // Ensure both exists and are affine
      if (sourceNode && targetNode) {
        const sourceRadius = sourceNode.getRadius()
        const targetRadius = targetNode.getRadius()
        edgeItem.trimPoints(
          sourceNode.getOrigin(), // OPTIMIZE save a fn call by direct at()
          targetNode.getOrigin(),
          sourceRadius,
          targetRadius
        )
      } else {
        console.warn('Tried to create edge between non-existent elements.')
      }
    })
  }
}
