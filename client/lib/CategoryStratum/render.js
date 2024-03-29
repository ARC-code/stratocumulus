const tapspace = require('tapspace')
const layoutGraph = require('./layout')
const config = require('../config')
const MIN_NODE_SIZE = config.sizing.minNodeSize
const MAX_NODE_SIZE = config.sizing.maxNodeSize
const CategoryNode = require('../CategoryNode')

module.exports = function (final = false, updateCount = 0) {
  // @CategoryStratum:render(final, updateCount)
  //
  // Render the graph. If elements already exist, update.
  // This method is idempotent, thus you can call this method multiple times
  // for example once for every new substratum from the server.
  //
  // Parameters:
  //   final
  //     optional boolean, default false. Set true to update edges
  //   updateCount
  //     optional integer, default 0. Index number of the subgraph event.
  //     .. Useful to identify and distinguish early and late rendering stages.
  //
  const nodePlaneOrigin = this.nodePlane.at(0, 0)

  const layoutPositions = layoutGraph(this.graph, this.context)

  // Map each node in graph model to a visible tapspace item.
  this.graph.forEachNode((key, attrs) => {
    let stratumNode = this.renderedNodes[key]

    if (stratumNode) {
      // Node already exists.
      // Update content and scale according to attributes.
      stratumNode.update(attrs)
    } else {
      // Node does not exist. Create.
      stratumNode = new CategoryNode(key, attrs)
      this.nodePlane.addChild(stratumNode.component)

      // Build index of rendered nodes.
      this.renderedNodes[key] = stratumNode
    }

    // Derive scale relative to the stratum basis.
    const nSize = (attrs.size ? attrs.size : MIN_NODE_SIZE)
    const nScale = 0.6 * nSize / MAX_NODE_SIZE
    stratumNode.setScale(nScale)
    // Update node position and scale according to the layout.
    const nPosition = layoutPositions[key]
    const nPoint = nodePlaneOrigin.offset(nPosition.x, nPosition.y)
    stratumNode.translateTo(nPoint)
  })

  // Re-compute bounding circle at each render.
  this.recomputeBoundingCircle()
  // Re-position the stratum w.r.t. its superstratum node.
  if (updateCount < 5 || Math.random() > 0.66) {
    this.scaleNodesToFit()
  }

  // Display and position the context label.
  // Repeat at each render.
  this.renderContextLabel()

  if (final) {
    // Enable faceting
    this.enableFaceting()
    // Draw edges
    this.graph.forEachEdge((edgeKey, edgeAttrs, sourceKey, targetKey) => {
      let edgeItem = this.renderedEdges[edgeKey]

      if (!edgeItem) {
        // No such edge yet rendered. Create
        edgeItem = tapspace.createEdge(3)
        edgeItem.addClass('stratum-edge')
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
        const scaler = 0.95 // ensure edge end goes under the node border.
        const sourceRadius = sourceNode.getRadius().scaleBy(scaler)
        const targetRadius = targetNode.getRadius().scaleBy(scaler)
        edgeItem.trimPoints(
          sourceNode.getOrigin(),
          targetNode.getOrigin(),
          sourceRadius,
          targetRadius
        )
      } else {
        console.warn('Tried to create edge between non-existent elements.')
      }
    })
  }

  // Signal that node positions might have changed,
  // so that possible substrata can be repositioned.
  this.emit('layout')
}
