module.exports = function (viewport) {
  // @CategoryStratum:triggerSubstratum(viewport)
  //
  // This method implements viewport dependent behavior
  // that subsequently initiates the loading of substratum if
  // zoom level and other viewport conditions so allow.
  //
  // Parameters:
  //   viewport
  //     a tapspace.components.Viewport
  //

  // On the current stratum, find the nearest openable node.
  const currentNode = this.findNearbyNode(viewport)

  // If current node is available and openable, open it.
  if (currentNode && currentNode.isFacetNode && !currentNode.isFaceted) {
    const subcontext = this.getSubcontext(currentNode)
    if (subcontext) {
      // Eventually triggers loading of the substratum.
      this.emit('substratumrequest', {
        context: subcontext,
        nodeKey: currentNode.key // TODO is really needed in the event?
      })
    }
  }
}
