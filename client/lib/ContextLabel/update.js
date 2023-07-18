const template = require('./template')

module.exports = function (context) {
  // Update label.
  this.component.html(template(context))
}
