module.exports = (Context) => {
  return (query) => {
    // @Context.fromQueryString(query)
    //
    // Create a Context from a query string, e.g. "f_genres.id=ABC"
    //
    // Parameters:
    //   query
    //     a string
    //
    // Return
    //   a Context
    //
    if (typeof query !== 'string') {
      throw new Error('Invalid query string: ' + query)
    }

    if (query.length === 0) {
      // Empty query, empty context
      return new Context([], [])
    }

    const keys = []
    const values = []

    const keyValues = query.split('&')

    keyValues.forEach((kv) => {
      const parts = kv.split('=')
      if (parts.length !== 2) {
        throw new Error('Invalid query string: ' + query)
      }

      keys.push(parts[0])
      values.push(parts[1])
    })

    // Keys and values are being validated inside the constructor.
    return new Context(keys, values)
  }
}
