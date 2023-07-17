const emitter = require('component-emitter')
const SearchForm = require('./SearchForm')
require('./toolbar.css')

const Toolbar = function () {
  // A component for search and information tools.
  //
  this.element = document.createElement('div')
  this.element.className = 'toolbar-box'

  this.searchForm = new SearchForm()

  this.element.appendChild(this.searchForm.getElement())

  // Forward search events
  this.searchForm.on('submit', (ev) => {
    this.emit('search', ev)
  })

  // For configuring search autocomplete after mounting
  this.configure = () => { this.searchForm.configure() }
}

module.exports = Toolbar
const proto = Toolbar.prototype

// Inherit
emitter(proto)

// Methods
proto.getElement = require('./getElement')

