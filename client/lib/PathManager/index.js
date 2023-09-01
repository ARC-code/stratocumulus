const Context = require('../Context')
const emitter = require('component-emitter')

const PathManager = function () {
  // @PathManager
  //
  // The path manager handles URL navigation and browser history.pushState.
  //

  this.context = new Context()

  // TODO prevent full page load if user navigates the history
  // window.addEventListener('popstate', (ev) => {
  //   console.log('popstate', ev)
  // })
}

module.exports = PathManager
const proto = PathManager.prototype
proto.isPathManager = true

// Inherit
emitter(proto)

// Methods
proto.setContext = require('./setContext')
proto.getContext = require('./getContext')
