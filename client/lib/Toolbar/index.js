require('./toolbar.css')
const emitter = require('component-emitter')
const SearchForm = require('./SearchForm')
const ContextForm = require('./ContextForm')

const Toolbar = function () {
  // A component for search and information tools.
  //
  // Emits:
  //   search { query }
  //   clear { parameter }
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

  this.contextForm = new ContextForm()
  this.element.appendChild(this.contextForm.getElement())

  // Forward context events
  this.contextForm.on('clear', (ev) => {
    if (ev.parameter === 'q') {
      this.emit('filter/keyword/clear')
    }
    if (ev.parameter === 'r_years') {
      this.emit('filter/years/clear')
    }
  })
}

module.exports = Toolbar
const proto = Toolbar.prototype

// Inherit
emitter(proto)

// Methods
proto.getElement = require('./getElement')

