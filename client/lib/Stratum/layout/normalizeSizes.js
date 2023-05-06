// const sizingConfig = require('../../config').sizing
const minAllowedSize = 10
const maxAllowedSize = 100
const allowedSizeRange = maxAllowedSize - minAllowedSize

const valueToSize = (minValue, maxValue, value) => {
  const valueRange = maxValue - minValue
  const normValue = (value - minValue) / valueRange
  // norm value is between 0..1

  const size = normValue * allowedSizeRange + minAllowedSize
  return parseInt(size)
}

module.exports = (graph) => {
  // Compute .size attributes for nodes according to values.
  //
  // Parameters:
  //   graph
  //     a graphology Graph
  //

  // Find min and max counts/values over the graph
  const extremeValues = graph.reduceNodes((acc, key, attrs) => {
    if (acc.minValue > attrs.value) {
      acc.minValue = attrs.value
    }
    if (acc.maxValue < attrs.value) {
      acc.maxValue = attrs.value
    }
    return acc
  }, {
    // Init
    minValue: 10,
    maxValue: 100
  })

  // Extract
  const minValue = extremeValues.minValue
  const maxValue = extremeValues.maxValue

  // console.log('minValue', minValue)
  // console.log('maxValue', maxValue)

  graph.updateEachNodeAttributes((key, attrs) => {
    return {
      ...attrs,
      size: valueToSize(minValue, maxValue, attrs.value)
    }
  })
}
