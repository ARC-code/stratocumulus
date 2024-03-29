module.exports = function (key, value) {
  // @Context:add(key, value)
  //
  // Add a context parameter as the last parameter. Creates a new Context.
  //
  // Parameters:
  //   key
  //     a string
  //   value
  //     a string
  //
  // Return
  //   a Context.
  //

  if (typeof key !== 'string' || key.length === 0) {
    throw new Error('Invalid context key: ' + key)
  }
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error('Invalid context value: ' + value)
  }

  const keys = this.keys.slice(0)
  const values = this.values.slice(0)

  // Prevent duplicate key-value
  const i = keys.indexOf(key)
  if (i >= 0) {
    // Key already exists.
    const origValue = values[i]
    if (origValue === value) {
      throw new Error('Duplicate context key-value pair: ' + key)
    }
  }

  // Add the key
  keys.push(key)
  values.push(value)

  const Context = this.constructor
  return new Context(keys, values)
}
