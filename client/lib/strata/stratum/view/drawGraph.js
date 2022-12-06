const tapspace = require('tapspace')
const nodeTemplate = require('./node/nodeTemplate')
const nodeSize = require('./node/nodeSize')
const generateNodeId = require('./node/generateNodeId')
const generateEdgeId = require('./edge/generateEdgeId')

module.exports = function (stratum, final = false) {
  // Render the graph. If elements already exist, update.
  //
  // Parameters:
  //   stratum
  //     a stratum object with 'path', 'div', and 'graph' properties
  //   final
  //     boolean, set true to update edges
  //
  const div = stratum.div
  const stratumPlane = div.affine
  const path = stratum.path
  const graph = stratum.graph

  const edgeGroup = stratumPlane.edgeGroup
  const nodeGroup = stratumPlane.nodeGroup

  graph.forEachNode(function (key, attrs) {
    // Prefixing node ids with path to prevent id collisions across strata
    const nId = generateNodeId(path, key)
    const nElem = document.getElementById(nId)

    const nPosition = stratumPlane.at(attrs.x, attrs.y)
    const nSize = nodeSize(attrs)

    if (nElem) {
      // Node exists. Update position and size.
      nElem.affine.translateTo(nPosition)
      nElem.affine.setSize(nSize, nSize)
    } else {
      // No such node yet. Create.
      const newElem = nodeTemplate(nId, attrs)
      const newItem = tapspace.createItem(newElem)
      newItem.element.id = nId
      newItem.setSize(nSize, nSize)
      newItem.setAnchor(newItem.atCenter())

      nodeGroup.addChild(newItem, nPosition)
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
        edgeItem.element.id = edgeId // TODO setId
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

    // Add click event for facetable nodes
    const facetableNodes = document.querySelectorAll('.node[data-facet_param]')
    const facetableClickHandler = (event) => {
      const facetParam = event.target.getAttribute('data-facet_param')
      const facetValue = event.target.getAttribute('data-facet_value')
      const context = {}
      context[`f_${facetParam}`] = facetValue
      console.log(`To create the newly faceted stratum, I'm assuming we'd call "build_stratum" with the following params:
  path: "${event.target.id.replaceAll('_', '/')}"
  context: ${context}
  label: "to be determined"
  bgColor: "to be determined"
  space: ?
      `)
    }
    facetableNodes.forEach(facetableNode => {
      facetableNode.removeEventListener('click', facetableClickHandler)
      facetableNode.addEventListener('click', facetableClickHandler)
    })
  }

  // strata[path].network = new vis.Network(strata[path].div, strata[path].data, graph_options)
  // strata[path].network.on("click", function(params) {
  //     if (params.nodes.length > 0) {
  //         let clickedUri = params.nodes[0]
  //         let node = strata[path].data.nodes.get(clickedUri)
  //         if (node.hasOwnProperty('kind')) {
  //             console.log(clickedUri)
  //             let objIdRegex = new RegExp("([^/]*)$", "gm")
  //             let objIdMatch = objIdRegex.exec(clickedUri)
  //             let objId = objIdMatch[1]
  //             let newContext = Object.assign({}, strata[path].context)
  //             newContext[f_{node.kind}.id] = objId
  //             buildStratum(clickedUri, newContext, node.label, node.color)
  //         }
  //     }
  // })
}
