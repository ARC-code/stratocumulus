require('./searchform.css')
const emitter = require('component-emitter')

const SearchForm = function () {
  // A search bar and a submit button
  //
  // Emits
  //   submit
  //     when a non-empty search keyword is submitted
  //

  const form = document.createElement('form')
  form.className = 'search-box'
  form.action = '#' // no-op

  form.innerHTML = [
    '<input type="text" tabindex="0" class="search-text" placeholder="Search" />',
    '<button type="submit" tabindex="0" class="search-button" aria-label="Go">',
    '<span aria-hidden="true" focusable="false">&#128269;</span>',
    '</button>'
  ].join('')

  this.element = form

  form.addEventListener('submit', (ev) => {
    // Prevent page reload
    ev.preventDefault()

    const query = form.querySelector('.search-text').value.trim()

    if (query.length > 0) {
      this.emit('submit', {
        query: query
      })
    }
  })
}

module.exports = SearchForm
const proto = SearchForm.prototype

// Inherit
emitter(proto)

// Methods
proto.getElement = require('./getElement')
