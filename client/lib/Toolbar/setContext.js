module.exports = function (newContext) {
  // @Toolbar:setContext(newContext)
  //
  // Propagate context changes to the forms and widgets.
  //

  this.contextForm.setContext(newContext)
  this.searchForm.setContext(newContext)
}
