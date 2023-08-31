require('./contextLabel.css')
const tapspace = require('tapspace')
const template = require('./template')

const ContextLabel = function (context, numArtifacts) {
  // @ContextLabel(context, numArtifacts)
  //
  // A Stratum context label. Displays the faceting context of the stratum.
  //
  // Parameters:
  //   context
  //     a Context
  //   numArtifacts
  //     a number
  //

  // Create label.
  const labelText = template(context, numArtifacts)
  const labelItem = tapspace.createItem(labelText)

  // Set size according to number of rows.
  const lines = labelText.split('<br>').length
  const height = lines * 100

  labelItem.setSize(600, height)
  labelItem.addClass('stratum-context-label')

  this.component = labelItem
}

module.exports = ContextLabel
const proto = ContextLabel.prototype
proto.isContextLabel = true

// Methods
proto.alignToBox = require('./alignToBox')
proto.update = require('./update')
