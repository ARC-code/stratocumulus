const Context = require('../Context')

module.exports = function () {
  // @PathManager:getContext()
  //
  // Get a Context from the current page URL.
  //
  // Returns:
  //   a Context
  //

  const query = window.location.search.toString().replace(/^\/?\??/, '')
  const context = Context.fromQueryString(query)

  // Update current for correct comparison in setContext
  this.context = context

  return context
}
