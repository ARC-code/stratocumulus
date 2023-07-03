module.exports = function (key, value) {
  // Add a context parameter. Creates a new Context.
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

  const ctx = Object.assign({}, this.ctx)

  if (ctx[key]) {
    // Key already exists.
    const origValue = ctx[key]
    if (origValue !== value) {
      // Merge
      ctx[key] = origValue + '__' + value
    }
  } else {
    // Add new key
    ctx[key] = value
  }

  const Context = this.constructor
  return new Context(ctx)
}
