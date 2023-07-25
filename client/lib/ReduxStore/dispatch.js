module.exports = function (action) {
  const newState = this.reducer(this.state, action)
  if (newState !== this.state) {
    // Change occurred
    this.state = newState
    this.subs.forEach(handler => handler())
  }
}
