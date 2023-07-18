const tapspace = require('tapspace')
const layoutGraph = require('./layout')
const StratumNode = require('../StratumNode')
const ArtifactNode = require('../ArtifactNode')

const RENDER_SIZE = 2560

module.exports = function (final = false, updateCount = 0) {
  // Render the graph. If elements already exist, update.
  // This method is idempotent, thus you can call this method multiple times
  // for example once for every new substratum from the server.
  //
  // Parameters:
  //   final
  //     boolean, set true to update edges
  //
  const stratumOrigin = this.space.at(0, 0)

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
        stratumNode = new ArtifactNode(key, attrs)
      } else {
        stratumNode = new StratumNode(key, attrs)
      }

      this.nodePlane.addChild(stratumNode.component)
      stratumNode.render(attrs)

      // Build index of rendered nodes.
      this.renderedNodes[key] = stratumNode

      // Build facet node index.
      if (!isDataCard && attrs.isFacetable) {
        const facetParam = attrs.facetParam
        const facetValue = attrs.facetValue
        if (facetParam && facetValue) {
          const facetContext = this.context.append(facetParam, facetValue)
          const facetPath = facetContext.toFacetPath()
          this.facetNodeIndex[facetPath] = key
        }
      }
    }

    // Update position according to the layout.
    const nPosition = layoutPositions[key]
    const nodePlaneOrigin = stratumOrigin.changeBasis(this.nodePlane)
    const nPoint = nodePlaneOrigin.offset(nPosition.x, nPosition.y)
    stratumNode.translateTo(nPoint)
    // Update size and scale according to attributes.
    stratumNode.render(attrs)
  })

  // Re-compute bounding circle at each render.
  this.recomputeBoundingCircle()
  // Re-position the stratum w.r.t. its superstratum node.
  if (updateCount < 5) {
    const circleOrigin = this.boundingCircle.atCenter()
    const circleRadius = this.boundingCircle.getRadius()
    const circleBottom = circleOrigin.polarOffset(circleRadius, Math.PI / 2)
    const targetOrigin = this.space.at(0, 0)
    const targetBottom = this.space.at(0, 0.618 * (RENDER_SIZE / 2))
    this.nodePlane.match({
      source: [circleOrigin, circleBottom],
      target: [targetOrigin, targetBottom],
      estimator: 'TS'
    })
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
        edgeItem = tapspace.createEdge('gray')
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
