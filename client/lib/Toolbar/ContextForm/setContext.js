const template = require('./template.ejs')
const io = require('../../io')

module.exports = function (newContext) {
  // @ContextForm:setContext(newContext)
  //
  // Replace the context and render the new one.
  //

  // Replace
  this.ctx = newContext
  // Render
  this.render()
}
