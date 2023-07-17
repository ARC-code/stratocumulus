const tapspace = require('tapspace')
const io = require('../io')

const makeLabelText = (context) => {
  const base = 'Everything filtered by'
  const facetContext = context.filter(key => {
    return key.startsWith('f')
  })
  // TODO print also filtering
  // const filteringContext = context.filter(key => {
  //   return key.startsWith('q') || key.startsWith('r')
  // })

  const labels = facetContext.map((facetParam, facetValue) => {
    const label = io.labelStore.read(facetParam, facetValue)
    return label || facetParam
  })

  if (labels.length > 0) {
    return base + '<br>' + labels.join(', ')
  }
  // Else
  return 'Everything'
}

module.exports = function () {
  // Render or update the large text label
  // that tells the user how the stratum was formed.

  const bbox = this.space.getBoundingBox() // TODO use .boundingCircle

  // Prevent duplicate context label creation
  if (!this.contextLabel) {
    const labelText = makeLabelText(this.context)
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
