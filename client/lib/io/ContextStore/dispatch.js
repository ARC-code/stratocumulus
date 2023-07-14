module.exports = function (action) {
  this.state = this.reducer(this.state, action)
  this.subs.forEach(handler => handler())
}
