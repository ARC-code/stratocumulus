module.exports = function () {
  // @Context:toArray()
  //
  // Get the context as a serialized array.
  //
  // Return
  //   an array of parameter objects. Each object has properties:
  //     parameter
  //       a string
  //     value
  //       a string
  //     type
  //       an enum char, one of 'f', 'q', 'r'.
  //
  // Example:
  // ```
  // > context.toArray()
  // [{ parameter, value, type, typeChar }]
  // ```
  //

  return this.keys.reduce((acc, k, i) => {
    acc.push({
      parameter: k,
      value: this.values[i],
      type: k.substring(0, 1)
    })
    return acc
  }, [])
}
