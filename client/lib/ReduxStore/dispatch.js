module.exports = function (action) {
  // @ReduxStore:dispatch(action)
  //
  // Parameters:
  //   action
  //     an object to be processed by the reducer.
  //
  const newState = this.reducer(this.state, action)
  if (newState !== this.state) {
    // Change occurred
    this.state = newState
    this.subs.forEach(handler => handler())
  }
}
