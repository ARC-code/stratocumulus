const emitter = require('component-emitter')
const SearchForm = require('./SearchForm')

const Toolbar = function () {
  // A component for search and information tools.
  //
  this.element = document.createElement('div')

  this.searchForm = new SearchForm()

  this.element.appendChild(this.searchForm.getElement())

  // Forward search events
  this.searchForm.on('submit', (ev) => {
    this.emit('search', ev)
  })
}

module.exports = Toolbar
const proto = Toolbar.prototype

// Inherit
emitter(proto)

// Methods
proto.getElement = require('./getElement')
