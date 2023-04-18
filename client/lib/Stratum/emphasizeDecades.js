const estimateCount = require('./decades').estimate
const normalizeSize = require('./model/normalizeSize')
const refreshCounts = require('./view/refreshCounts')

module.exports = function (beginYear, endYear) {
  // Make the nodes, that have documents within this time range,
  // stand out from the others. Does not remove or completely hide
  // the unmatched nodes.
  //
  // Parameters
  //   beginYear
  //     a number, inclusive year
  //   endYear
  //     a number, inclusive year
  //

  if (beginYear > endYear) {
    // Switch
    const trueEnd = beginYear
    beginYear = endYear
    endYear = trueEnd
  }

  // Update the filtering context for further queries
  this.context.r_years = beginYear + 'to' + endYear

  // Refresh the graph nodes based on the year range.
  this.graph.updateEachNodeAttributes((nodeKey, nodeAttrs) => {
    const decades = nodeAttrs.decades

    if (Object.keys(decades).length === 0) {
      // Nodes with empty decades. Maybe navigational nodes. Keep the same.
      return nodeAttrs
    }

    const count = estimateCount(decades, beginYear, endYear)

    // Update node model values and sizes.
    return {
      ...nodeAttrs,
      value: count,
      size: normalizeSize(count)
    }
  })

  // Refresh the rendered node sizes.
  refreshCounts(this.space, this.graph)
}
