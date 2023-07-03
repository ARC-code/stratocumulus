module.exports = function (key, value) {
  // @Context:remove(key[, value])
  //
  // Remove a context parameter. Creates a new Context.
  //
  // Parameters:
  //   key
  //     a string
  //   value
  //     optional string. If given, remove only this value.
  //
  // Return
  //   a Context.
  //

  if (typeof key !== 'string' || key.length === 0) {
    throw new Error('Invalid context key: ' + key)
  }

  const keys = this.keys.slice(0)
  const values = this.values.slice(0)

  const Context = this.constructor
  const i = keys.indexOf(key)

  if (i < 0) {
    // No such key. Just return a copy.
    return new Context(keys, values)
  }

  if (typeof value === 'undefined') {
    // Remove all values of the key
    keys.splice(i, 1)
    values.splice(i, 1)
    return new Context(keys, values)
  }

  // Value is defined. Validate.
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error('Invalid context value: ' + value)
  }

  const origValue = values[i]
  const valueParts = origValue.split('__')
  // Remove given value, maintain order.
  const newValue = valueParts.filter(p => p !== value).join('__')
  if (newValue.length > 0) {
    // Replace value
    values[i] = newValue
  } else {
    // Empty value. Remove also key.
    keys.splice(i, 1)
    values.splice(i, 1)
  }

  return new Context(keys, values)
}
