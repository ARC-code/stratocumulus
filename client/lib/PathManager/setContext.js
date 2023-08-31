const history = window.history

module.exports = function (context) {
  // @PathManager:setContext(context)
  //
  // Rewrite the current URL to reflect the given Context.
  //

  const query = context.toQueryString()

  // Prevent unnecessary pushing
  if (this.context.toQueryString() === query) {
    // Not changed. Skip.
    return
  }
  // Save for next comparison round.
  this.context = context

  let url = '/'
  if (query.length > 0) {
    url += '?' + query
  }

  history.pushState({}, '', url)
}
