module.exports = function (key, value) {
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

  const ctx = Object.assign({}, this.ctx)

  if (typeof value === 'undefined') {
    // Remove only key
    delete ctx[key]
  } else {
    if (typeof value !== 'string' || value.length === 0) {
      throw new Error('Invalid context value')
    }

    const origValue = ctx[key]
    if (origValue) {
      const values = origValue.split('__')
      // Remove given value, maintain order.
      const newValue = values.filter(v => v !== value).join('__')
      if (newValue.length > 0) {
        ctx[key] = newValue
      } else {
        delete ctx[key]
      }
    } // Else, nothing to remove
  }

  const Context = this.constructor
  return new Context(ctx)
}
