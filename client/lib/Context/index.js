
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
  if (typeof values === 'undefined') {
    values = []
  }

  // Validate
  if (!keys || !Array.isArray(keys)) {
    throw new Error('Invalid context keys: ' + keys)
  }
  if (!values || !Array.isArray(values)) {
    throw new Error('Invalid context values: ' + values)
  }
  if (keys.length !== values.length) {
    throw new Error('Invalid context: conflicting number of keys and values')
  }
  if (!keys.every(k => typeof k === 'string' && k.length > 0)) {
    throw new Error('Invalid context keys: ' + keys)
  }
  if (!values.every(v => typeof v === 'string' && v.length > 0)) {
    throw new Error('Invalid context values: ' + values)
  }
  const duplicate = keys.find((k, i) => {
    const ki = keys.indexOf(k)
    return ki !== i && values[ki] === values[i]
  })
  if (duplicate) {
    throw new Error('Duplicate context key-value pair: ' + duplicate)
  }

  this.keys = keys
  this.values = values
}

module.exports = Context
const proto = Context.prototype
proto.isContext = true

// Class functions
Context.fromContextObject = require('./fromContextObject')(Context)
Context.fromFacetPath = require('./fromFacetPath')(Context)
Context.fromQueryString = require('./fromQueryString')(Context)

// Methods
proto.append = require('./append')
proto.copy = require('./copy')
proto.merge = require('./merge')
proto.remove = require('./remove')
proto.removeLastFacet = require('./removeLastFacet')
proto.toArray = require('./toArray')
proto.toContextObject = require('./toContextObject')
proto.toFacetPath = require('./toFacetPath')
proto.toNodeKey = require('./toNodeKey')
proto.toQueryString = require('./toQueryString')
