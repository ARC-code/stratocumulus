module.exports = function (handler) {
  // @ReduxStore:subscribe(handler)
  //
  // Parameters:
  //   handler
  //     a function () that is called when an action changes the state.
  //
  this.subs.push(handler)
}
