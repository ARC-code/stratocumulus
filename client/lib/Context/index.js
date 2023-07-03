
const Context = function (keys, values) {
  // @Context(keys, values)
  //
  // Class and methods for handling Corpora context objects.
  // Keeps the keys and values in the correct order.
  // Immutable.
  //
  // Parameters:
  //   keys
  //     array of string
  //   values
  //     array of string
  //

  // Default
  if (typeof keys === 'undefined') {
    keys = []
    values = []
  }

  // Validate
  if (!keys || !Array.isArray(keys)) {
    throw new Error('Invalid context keys: ' + keys)
  }
  if (!values || !Array.isArray(values)) {
    throw new Error('Invalid context values: ' + values)
  }
  if (!keys.every(k => typeof k === 'string' && k.length > 0)) {
    throw new Error('Invalid context keys: ' + keys)
  }
  if (!values.every(v => typeof v === 'string' && v.length > 0)) {
    throw new Error('Invalid context values: ' + values)
  }
  const duplicate = keys.find((k, i) => {
    const ki = keys.indexOf(k)
    return ki !== i
  })
  if (duplicate) {
    throw new Error('Duplicate context key: ' + duplicate)
  }

  this.keys = keys
  this.values = values
}

module.exports = Context
const proto = Context.prototype

proto.append = require('./append')
proto.getQueryString = require('./getQueryString')
proto.merge = require('./merge')
proto.plain = require('./plain')
proto.remove = require('./remove')
