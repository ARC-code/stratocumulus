const tapspace = require('tapspace')
const template = require('./template.ejs')
require('./style.css')

const CorporaCard = function (key) {
  // DataCard is a card-like element in space.
  //
  // Parameters:
  //   key
  //     a string, some corpora-specific id.
  //

  this.element = document.createElement('div')
  this.element.className = 'data-node'

  this.element.innerHTML = template({
    // The initial template parameters.
    // Fetching updates or more data can either modify the DOM directly or
    // render the template again.
  })

  // Create an item to add to the space.
  this.spaceItem = tapspace.createItem(this.element)

  // Fetch content for the card.
  // See fetch() https://developer.mozilla.org/en-US/docs/Web/API/fetch
}

module.exports = CorporaCard
