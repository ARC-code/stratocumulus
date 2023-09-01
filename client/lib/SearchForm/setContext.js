module.exports = function (newContext) {
  // @SearchForm:setContext(newContext)
  //
  // Replace the current context used by the search form.
  //

  // Any existing keyword should not affect the search form autocompletion.
  const skipParams = ['q', 'f_title', 'f_agents.label.raw']
  // Refresh context with the keyword parameters removed.
  this.ctx = newContext.filter((key, value) => {
    return !skipParams.includes(key)
  })

  // TODO refresh search bar content to reflect the new context,
  // if any such changes make sense.
  // For a possible example, close or refresh the autocompletion list.
}
