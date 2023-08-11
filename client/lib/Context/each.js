module.exports = function (fn) {
  // @Context:each(fn)
  //
  // Call the function for each key-value pair.
  //
  // Parameters:
  //   fn
  //     a function (key, value) => any
  //
  const len = this.keys.length
  for (let i = 0; i < len; i += 1) {
    fn(this.keys[i], this.values[i])
  }
}
