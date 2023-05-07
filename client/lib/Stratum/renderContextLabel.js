const tapspace = require('tapspace')
const labelCache = require('../labelCache')

const makeLabelText = (context) => {
  const base = 'Everything filtered by'
  const facetParams = Object.keys(context)

  const validLabels = []
  for (let i = 0; i < facetParams.length; i += 1) {
    const fParam = facetParams[i]
    const fValues = context[fParam].split('__')
    // Check if any labels for the facet param and value
    for (let j = 0; j < fValues.length; j += 1) {
      const fValue = fValues[j]
      const label = labelCache.read(fParam, fValue)
      if (label) {
        validLabels.push(label)
      }
    }
  }

  if (validLabels.length > 0) {
    return base + '<br>' + validLabels.join(', ')
  }
  // Else
  return 'Everything'
}

module.exports = function () {
  // Render or update the large text label
  // that tells the user how the stratum was formed.

  const context = this.context
  const bbox = this.space.getBoundingBox()

  // console.log('context', context)

  // Prevent duplicate context label creation
  if (!this.contextLabel) {
    const labelText = makeLabelText(context)
    const labelItem = tapspace.createItem(labelText)
    labelItem.setSize(600, 50)
    labelItem.addClass('stratum-context-label')
    this.space.addChild(labelItem)
    // Move below the stratum.
    labelItem.match({
      source: labelItem.atTopMid(),
      target: bbox.atNorm(0.5, 1.05)
    })
    // Scale so that it matches the stratum width.
    // If the space is empty, the width goes to zero and then scaling does
    // not work anymore. Thus prevent.
    const bboxWidth = bbox.getWidth()
    // TODO use something like tapspace.geometry.Box:isEmpty ?
    if (bboxWidth.getRaw() > 0) {
      labelItem.scaleToWidth(bboxWidth, labelItem.atTopMid())
    }
    // Else the box is empty, so we just match the space scale,
    // and that is already so.

    this.contextLabel = labelItem
  }
}
