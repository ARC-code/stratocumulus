const template = require('./template')

module.exports = function (attrs) {
  // @CategoryNode:render(attrs)
  //
  // Parameters:
  //   attrs
  //     graph model node attributes
  //

  const nodeIsStale = attrs.stale
  const nodeValue = attrs.value || 0
  if (nodeValue < 0.1 || nodeIsStale) {
    this.component.addClass('empty-node')
  } else {
    this.component.removeClass('empty-node')
  }

  // Just render again and replace
  this.component.html(template(attrs))
}
