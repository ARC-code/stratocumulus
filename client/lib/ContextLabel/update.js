const template = require('./template')

module.exports = function (context) {
  // @ContextLabel:update(context)
  //
  // Update the context and render the label again.
  //
  this.component.html(template(context))
}
