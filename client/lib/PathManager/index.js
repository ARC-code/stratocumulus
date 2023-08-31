const Context = require('../Context')

const PathManager = function () {
  // @PathManager
  //
  // The path manager handles URL navigation and browser history.pushState.
  //

  this.context = new Context()
}

module.exports = PathManager
const proto = PathManager.prototype
proto.isPathManager = true

// Methods
proto.setContext = require('./setContext')
proto.getContext = require('./getContext')
