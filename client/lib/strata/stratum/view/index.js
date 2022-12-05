const nodeTemplate = require('./nodeTemplate')
const nodeSize = require('./nodeSize')
const tapspace = require('tapspace')

exports.createNetworkDiv = function (space, id) {
  // Create container for the stratum
  //
  // Parameters:
  //   space
  //     a Tapspace space into which to add the network div.
  //   id
  //     string, a valid html id for the network div.
  //
  // Return
  //   a HTMLElement with affine perk
  //

  // Space plane for content. Adds the plane to the space.
  const networkPlane = space.createPlane()

  // Set element attributes so we can refer to the element.
  const networkDiv = networkPlane.getElement()
  networkDiv.id = id
  networkDiv.className = 'network'

  // Create groups for nodes and edges
  const nodeGroup = new tapspace.components.Group()
  const edgeGroup = new tapspace.components.Group()

  // Add edge group first so they will be drawn first.
  networkPlane.add(edgeGroup)
  networkPlane.add(nodeGroup)

  // A sketchy way to refer to the groups later. TODO improve.
  networkPlane.edgeGroup = edgeGroup
  networkPlane.nodeGroup = nodeGroup

  // networkDiv.scrollIntoView() // TODO is necessary?

  return networkDiv
}

exports.drawGraph = function (stratum, final = false) {
  // Render the graph. If elements already exist, update.
  //
  // Parameters:
  //   stratum
  //     a stratum object with 'path', 'div', and 'graph' properties
  //   final
  //     boolean, set true to update edges
  //
  const div = stratum.div
  const plane = div.affine
  const path = stratum.path
  const graph = stratum.graph

  const edgeGroup = plane.edgeGroup
  const nodeGroup = plane.nodeGroup

  graph.forEachNode(function (key, attrs) {
    // Prefixing node ids with path to prevent id collisions across strata
    const nId = `${path}${key}`.replaceAll('/', '_')
    const nElem = document.getElementById(nId)

    const nx = attrs.x
    const ny = attrs.y
    const sizeMargin = 4
    const nSize = nodeSize(attrs) + sizeMargin

    if (nElem) {
      // Node exists. Update position.
      nElem.affine.translateTo(plane.at(nx, ny))
      // Update also size.
      nElem.affine.setSize({
        width: nSize,
        height: nSize
      })
    } else {
      // No such node yet. Create.
      const newElem = nodeTemplate(nId, attrs)
      const newItem = tapspace.element(newElem, {
        id: nId,
        size: {
          width: nSize,
          height: nSize
        },
        anchor: {
          x: nSize / 2,
          y: nSize / 2
        }
      })
      nodeGroup.addChild(newItem, plane.at(nx, ny))
    }
  })

  if (final) {
    // Draw edges
    graph.forEachEdge(function (edgeKey, edgeAttrs, sourceKey, targetKey) {
      // Prefixing all ids with path to prevent id collisions across strata
      const sourceId = `${path}${sourceKey}`.replaceAll('/', '_')
      const targetId = `${path}${targetKey}`.replaceAll('/', '_')
      const edgeId = `${path}${edgeKey}`.replaceAll('/', '_')

      const edgeEl = document.getElementById(edgeId)

      let edgeItem
      if (edgeEl) {
        // Edge exists.
        edgeItem = edgeEl.affine
      } else {
        // No such edge yet. Create.
        edgeItem = tapspace.edge('white', {
          id: edgeId,
          className: 'edge'
        })
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

exports.refreshLabels = function (stratum, space) {
  // Show/hide labels depending on visible node size.
  //
  // Parameters:
  //   stratum
  //     a stratum object
  //   space
  //     a tapspace space, required for finding node size relative to viewport.
  //
  const stratumPlane = stratum.div.affine
  const nodes = stratumPlane.nodeGroup.getChildren() // HACKY

  nodes.forEach((node) => {
    // Determine node size on viewport.
    const size = node.getWidth() // a Distance on node
    const sizeOnViewport = size.changeBasis(space).d

    // Show if large enough, ensure hidden otherwise.
    const label = node.getElement().querySelector('.label')
    // Check that label exists.
    if (label) {
      if (sizeOnViewport >= 20) {
        label.style.display = 'inline'
      } else {
        label.style.display = 'none'
      }
    }
  })
}
