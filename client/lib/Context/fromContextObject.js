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

    const rawKeys = Object.keys(obj)
    const rawValues = Object.values(obj)
    const len = rawKeys.length

    const keys = []
    const values = []

    // Split double underscore values.
    for (let i = 0; i < len; i += 1) {
      const v = rawValues[i]
      const parts = v.split('__')
      for (let j = 0; j < parts.length; j += 1) {
        keys.push(rawKeys[i])
        values.push(parts[j])
      }
    }

    // Keys and values are being validated inside the constructor.
    return new Context(keys, values)
  }
}
