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

  const Context = this.constructor
  const matchValue = typeof value !== 'undefined'

  // If value is defined, validate.
  if (matchValue) {
    if (typeof value !== 'string' || value.length === 0) {
      throw new Error('Invalid context value: ' + value)
    }
  }

  const keys = []
  const values = []
  const len = this.keys.length
  for (let i = 0; i < len; i += 1) {
    if (this.keys[i] === key) {
      // Same key, maybe skip.
      if (matchValue && this.values[i] !== value) {
        // Same key but different value, thus keep.
        keys.push(this.keys[i])
        values.push(this.values[i])
      }
    } else {
      // Different key, thus keep.
      keys.push(this.keys[i])
      values.push(this.values[i])
    }
  }

  return new Context(keys, values)
}
