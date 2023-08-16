module.exports = function (context, facetParam, facetValue) {
  // Jump viewport to certain stratum node if such node is available.
  //
  // Parameters
  //   context
  //     a Context, defines the current stratum.
  //   facetParam
  //     a string, node's faceting parameter
  //   facetValue
  //     a string, node's faceting value
  //

  // Find current stratum.
  const path = context.toFacetPath()
  const space = this.loader.getSpace(path)
  if (!space) {
    console.warn('Cannot find navigable stratum: ' + path)
  }
  const stratum = space.stratum

  // Find the node within stratum.
  const subcontext = context.append(facetParam, facetValue)
  const nodePath = subcontext.toFacetPath()
  const stratumNode = stratum.getFacetNode(nodePath)

  // Zoom to node component
  const duration = 800
  this.viewport.animateOnce({ duration })
  this.viewport.zoomToFill(stratumNode.component, 0.5)
  // TODO emit idle after animation
  setTimeout(() => {
    this.viewport.hyperspace.commit()
    this.viewport.emit('idle')
  }, duration)
}
