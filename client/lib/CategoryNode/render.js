const template = require('./template')

module.exports = function () {
  // @CategoryNode:render()
  //
  // Refresh the contents.
  //

  const nodeIsStale = this.data.stale
  const nodeValue = this.data.value || 0
  if (nodeValue < 0.1 || nodeIsStale) {
    this.component.addClass('empty-node')
  } else {
    this.component.removeClass('empty-node')
  }

  // Just render again and replace
  this.component.html(template(this.data))
}
