
const Context = function (obj) {
  // Class and methods for handling Corpora context objects.
  // Immutable.
  //
  // Parameters:
  //   obj
  //     a valid Corpora context object
  //

  // Default
  if (typeof obj === 'undefined') {
    obj = {}
  }

  // Validate
  if (!obj || typeof obj !== 'object') {
    throw new Error('Invalid context objext: ' + obj)
  }
  if (!Object.values(obj).every(v => typeof v === 'string' && v.length > 0)) {
    throw new Error('Invalid context object values: ' + obj)
  }

  this.ctx = obj
}

module.exports = Context
const proto = Context.prototype

proto.add = require('./add')
proto.merge = require('./merge')
proto.plain = require('./plain')
proto.remove = require('./remove')
