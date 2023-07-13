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
  // Emits:
  //   clear { parameter }
  //

  this.ctx = new Context()

  // Prepare container
  this.element = document.createElement('div')
  this.element.className = 'context-box'
  // Create content
  this.render()

  // Bind once. Delegate via root element.
  this.element.addEventListener('click', (ev) => {
    const dataset = ev.target.dataset
    if (!dataset.facetParam) {
      // Clicked outside active elements.
      return
    }

    if (dataset.action === 'remove') {
      const param = dataset.facetParam
      this.emit('clear', {
        parameter: dataset.facetParam
      })
    }
  })
}

module.exports = ContextForm
const proto = ContextForm.prototype

// Inherit
emitter(proto)

proto.getElement = require('./getElement')
proto.render = require('./render')
proto.setContext = require('./setContext')
