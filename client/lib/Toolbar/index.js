require('./toolbar.css')
const emitter = require('component-emitter')
const SearchForm = require('./SearchForm')
const ContextForm = require('./ContextForm')
const Context = require('../Context')

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

  this.contextForm = new ContextForm()
  this.element.appendChild(this.contextForm.getElement())
  this.contextForm.setContext(new Context()) // init

  // Forward context events
  this.contextForm.on('change', (ev) => {
    this.emit('contextchange', ev)
  })
}

module.exports = Toolbar
const proto = Toolbar.prototype

// Inherit
emitter(proto)

// Methods
proto.getElement = require('./getElement')
