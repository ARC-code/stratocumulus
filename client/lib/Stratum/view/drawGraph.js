const tapspace = require('tapspace')
const nodeTemplate = require('./node/nodeTemplate')
const nodeSize = require('./node/nodeSize')
const generateNodeId = require('./node/generateNodeId')
const generateEdgeId = require('./edge/generateEdgeId')
const layoutGraph = require('./layout')

module.exports = function (stratum, final = false) {
  // Render the graph. If elements already exist, update.
  //
  // Parameters:
  //   stratum
  //     a stratum object with 'path', 'plane', and 'graph' properties
  //   final
  //     boolean, set true to update edges
  //
  const stratumSpace = stratum.space
  const stratumOrigin = stratumSpace.at(0, 0)
  const path = stratum.path
  const graph = stratum.graph

  const edgeGroup = stratumSpace.edgeGroup
  const nodeGroup = stratumSpace.nodeGroup

  const layoutPositions = layoutGraph(stratum.graph, stratum.context)

  // Map each node in graph model to a visible tapspace item.
  graph.forEachNode(function (key, attrs) {
    // Prefixing node ids with path to prevent id collisions across strata
    const nId = generateNodeId(path, key)
    const nElem = document.getElementById(nId)

    const nPosition = layoutPositions[key]
    const nPoint = stratumOrigin.offset(nPosition.x, nPosition.y)
    const nSize = nodeSize(attrs)

    if (nElem) {
      // Node exists. Update position and size.
      nElem.affine.translateTo(nPoint)
      const newSize = { w: nSize, h: nSize }
      nElem.affine.resizeTo(newSize, nElem.affine.atCenter())

      const roundElement = nElem.querySelector('.node')
      const countElement = nElem.querySelector('.node-label-count')

      const nodeIsStale = attrs.stale
      const nodeValue = attrs.value
      if (nodeValue < 0.1 || nodeIsStale) {
        roundElement.classList.add('empty-node')
      } else {
        roundElement.classList.remove('empty-node')
      }

      // Update the label count. Some nodes do not have counts.
      // Stale nodes have unknown count.
      if (countElement) {
        if (nodeIsStale) {
          // Still waiting for valid count
          countElement.innerText = '***'
        } else {
          // Add thousands separator for readability
          countElement.innerText = nodeValue.toLocaleString('en-US')
        }
      }
    } else {
      // No such node yet. Create.
      const newElem = nodeTemplate(nId, attrs)
      const newItem = tapspace.createItem(newElem)
      newItem.setId(nId)
      newItem.setSize(nSize, nSize)
      // Gravity at node center
      newItem.setAnchor(newItem.atCenter())
      // Disable interaction with node content.
      newItem.setContentInput(false)
      // Make it easy to find node attributes via tapspace component.
      // NOTE does not follow changes in the graph model. TODO improve
      newItem.model = {
        nodeKey: key,
        nodeAttributes: attrs
      }
      // Track if the item is interactive.
      // TODO use future tapspace methods to check this.
      newItem.interactiveNode = false

      nodeGroup.addChild(newItem, nPoint)
    }
  })

  if (final) {
    // Draw edges
    graph.forEachEdge(function (edgeKey, edgeAttrs, sourceKey, targetKey) {
      // Prefixing all ids with path to prevent id collisions across strata
      const sourceId = generateNodeId(path, sourceKey)
      const targetId = generateNodeId(path, targetKey)
      const edgeId = generateEdgeId(path, edgeKey)

      const edgeEl = document.getElementById(edgeId)

      let edgeItem
      if (edgeEl) {
        // Edge exists.
        edgeItem = edgeEl.affine
      } else {
        // No such edge yet. Create.
        edgeItem = tapspace.createEdge('gray')
        edgeItem.addClass('edge')
        edgeItem.setId(edgeId)
        // Make it easy to find edge attributes via tapspace component.
        // TODO mark only the key because attributes become stale.
        edgeItem.model = {
          edgeKey: edgeKey,
          edgeAttributes: edgeAttrs,
          sourceKey: sourceKey,
          targetKey: targetKey
        }

        edgeGroup.addChild(edgeItem)
      }

      // Move edge to position. We need the nodes.
      const sourceElem = document.getElementById(sourceId)
      const targetElem = document.getElementById(targetId)

      // Ensure both exists and are affine
      if (sourceElem && targetElem) {
        if (sourceElem.affine && targetElem.affine) {
          // Edge endpoints are valid tapspace elements.
          edgeItem.setPoints(
            sourceElem.affine.atAnchor(),
            targetElem.affine.atAnchor()
          )
        } else {
          console.error('Tried to create edge between non-tapspace elements.')
        }
      } else {
        console.warn('Tried to create edge between non-existent elements.')
      }
    })

    // Make facetable nodes interactive
    const facetableClickHandler = (event) => {
      const clickedItem = event.component
      const attrs = clickedItem.model.nodeAttributes
      const facetPath = attrs.id
      const facetParam = attrs.facetParam
      const facetValue = attrs.facetValue
      const newContext = Object.assign({}, stratum.context)

      if (newContext[facetParam]) {
        const currentValues = newContext[facetParam].split('__')

        if (!currentValues.includes(facetValue)) {
          currentValues.push(facetValue)
        }
        newContext[facetParam] = currentValues.join('__')
      } else {
        newContext[facetParam] = facetValue
      }

      // Make the node transparent or somehow allow users to see
      // the new stratum within
      clickedItem.addClass('faceted-node')

      // The click emits an event "stratumrequest" which is listened on
      // strata-level, so that individual stratum does not need to know
      // about or control other strata.
      const position = clickedItem.atCenter().offset(0, 0, 10)
      stratum.emit('stratumrequest', {
        path: facetPath,
        context: newContext,
        label: 'todo',
        bgColor: 'todo',
        position: position
      })
    }
    const facetableItems = nodeGroup.getChildren().filter(nodeItem => {
      return nodeItem.model.nodeAttributes.isFacetable
    })
    facetableItems.forEach(item => {
      // Prevent duplicate interaction setup
      if (!item.interactiveNode) {
        item.interactiveNode = true // TODO use future tapspace methods to test
        item.tappable()
        item.on('tap', facetableClickHandler)
      }
    })
  }
}
