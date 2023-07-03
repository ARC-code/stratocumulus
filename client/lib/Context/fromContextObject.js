module.exports = (Context) => {
  return (obj) => {
    // @Context.fromContextObject(obj)
    //
    // Create a Context from an object.
    //
    // Parameters:
    //   obj
    //     an object with string keys and string values.
    //
    // Return
    //   a Context
    //
    if (!obj || typeof obj !== 'object') {
      throw new Error('Invalid context object: ' + obj)
    }

    const keys = Object.keys(obj)
    const values = Object.values(obj)

    // Keys and values are being validated inside the constructor.
    return new Context(keys, values)
  }
}
