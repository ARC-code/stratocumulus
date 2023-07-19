require('./contextLabel.css')
const tapspace = require('tapspace')
const template = require('./template')

const ContextLabel = function (context) {
  // A stratum context label.

  // Create label.
  const labelText = template(context)
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
