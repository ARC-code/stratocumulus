module.exports = function (fn) {
  // @Context:filter(fn)
  //
  // Filter the context using a boolean function.
  //
  // Parameters:
  //   fn
  //     a function (key, value) => bool
  //
  // Return
  //   a Context
  //

  const keys = []
  const values = []
  const len = this.keys.length

  for (let i = 0; i < len; i += 1) {
    if (fn(this.keys[i], this.values[i])) {
      keys.push(this.keys[i])
      values.push(this.values[i])
    }
  }

  const Context = this.constructor
  return new Context(keys, values)
}
