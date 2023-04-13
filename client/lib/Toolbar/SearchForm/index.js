const emitter = require('component-emitter')

const SearchForm = function () {
  // A search bar and a submit button
  //

  const form = document.createElement('form')
  form.className = 'search-box'
  form.action = '#' // no-op

  form.innerHTML = [
    '<input type="text" class="search-text" placeholder="Search" />',
    '<button type="submit" class="search-button" aria-label="Go">',
    '<span aria-hidden="true" focusable="false">&#128269;</span>',
    '</button>'
  ].join('')

  this.element = form

  form.addEventListener('submit', (ev) => {
    // Prevent page reload
    ev.preventDefault()

    const query = form.querySelector('.search-text').value.trim()
    this.emit('submit', {
      query: query
    })
  })
}

module.exports = SearchForm
const proto = SearchForm.prototype

// Inherit
emitter(proto)

// Methods
proto.getElement = require('./getElement')
