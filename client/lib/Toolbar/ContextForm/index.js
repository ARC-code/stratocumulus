require('./contextform.css')
const emitter = require('component-emitter')
const Context = require('../../Context')

const ContextForm = function () {
  // @ContextForm
  //
  // ContextForm is a viewer and editor for the current Context.
  // It emits events when the context is modified through it.
  // It provides methods to update the context it is currently viewing.
  //

  this.ctx = new Context()

  // Prepare container
  this.element = document.createElement('div')
  this.element.className = 'context-box'
  // Create content
  this.render()
}

module.exports = ContextForm
const proto = ContextForm.prototype

// Inherit
emitter(proto)

proto.getElement = require('./getElement')
proto.render = require('./render')
proto.setContext = require('./setContext')
