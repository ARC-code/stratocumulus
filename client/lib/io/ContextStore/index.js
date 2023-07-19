const reducer = require('./reducer')
const Context = require('../../Context')

const ContextStore = function () {
  // ContextStore is a Redux-like store for updating a Context object
  // and reacting to its changes.
  //
  this.state = new Context()
  this.subs = []
  this.reducer = reducer
}

module.exports = ContextStore
const proto = ContextStore.prototype

// Redux API
proto.dispatch = require('./dispatch')
proto.getState = require('./getState')
proto.subscribe = require('./subscribe')
