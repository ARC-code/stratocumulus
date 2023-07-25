const ReduxStore = function (initState, reducer) {
  // ReduxStore is a Redux-like store for updating a Context object
  // and reacting to its changes.
  //
  this.state = initState
  this.subs = []
  this.reducer = reducer
}

module.exports = ReduxStore
const proto = ReduxStore.prototype

// Redux API
proto.dispatch = require('./dispatch')
proto.getState = require('./getState')
proto.subscribe = require('./subscribe')
