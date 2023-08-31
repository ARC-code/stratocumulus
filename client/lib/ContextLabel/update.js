const template = require('./template')

module.exports = function (context, numArtifacts) {
  // @ContextLabel:update(context, numArtifacts)
  //
  // Update the context and render the label again.
  //
  this.component.html(template(context, numArtifacts))
}
