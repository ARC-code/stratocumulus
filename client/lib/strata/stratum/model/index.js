const graphology = require('graphology')
const graphologyLayout = require('graphology-layout')
// const graphologyForce = require('graphology-layout-force')
// const graphologyNoverlap = require('graphology-layout-noverlap')

const config = require('../../../config')
const normalizeSize = require('./normalizeSize')
// const optimizeRotation = require('./optimizeRotation')

const kindColorMap = config.kindColorMap
const defaultColor = config.defaultColor

exports.createGraph = function () {
  // Create a new graph
  return new graphology.Graph()
}

exports.updateGraph = function (graph, subgraph) {
  // Update the graph object with a subgraph received from the server.
  //
  // Parameters:
  //   graph
  //     a graph to update. Will be modified.
  //   subgraph
  //     object, received from the server, has optional properties:
  //       nodes
  //         optional array of node objects. Each node object has properties:
  //           id
  //           label
  //           value
  //           fixed
  //           parent
  //           facet_param
  //           facet_value
  //       edges
  //         optional array of edge objects
  //
  if ('nodes' in subgraph) {
    subgraph.nodes.forEach(n => {
      // Ensure no such node exists yet.
      // Server might send some nodes multiple times.
      if (graph.hasNode(n.id)) {
        console.warn(`Duplicate for node ${n.id} detected.`) // DEBUG
        return
      }

      const attrs = { label: n.label, x: 1, y: 1 }

      if ('kind' in n && n.kind in kindColorMap) {
        attrs.color = kindColorMap[n.kind]
      } else {
        attrs.color = defaultColor
      }

      if ('value' in n) attrs.size = normalizeSize(n.value)
      if ('fixed' in n) attrs.fixed = n.fixed
      if ('parent' in n) attrs.parent = n.parent
      if ('facet_param' in n) attrs.facet_param = n.facet_param
      if ('facet_value' in n) attrs.facet_value = n.facet_value

      graph.addNode(n.id, attrs)
    })
  }

  if ('edges' in subgraph) {
    subgraph.edges.forEach(e => graph.addEdge(e.from, e.to))
  }
}

exports.performLayout = function (graph, final = false) {
  // Apply layout to a graph.
  //
  // Parameters
  //   graph
  //     a graphology graph object. Will be modified.
  //

  graphologyLayout.circlepack.assign(graph, {
    hierarchyAttributes: ['parent'],
    center: 0,
    scale: 1.1
  })

  // if (!final) {
  //   graphologyLayout.circlepack.assign(graph, {
  //     hierarchyAttributes: ['parent'],
  //     center: 0,
  //     scale: 1.1
  //   })
  // }
  //
  // if (final) {
  //   optimizeRotation(graph)
  // }
}
