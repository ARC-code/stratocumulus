module.exports = (Context) => {
  return (path) => {
    // @Context.fromFacetPath(path)
    //
    // Create a context from a facet path, e.g. "/?f_genres.id=ABC"
    //
    // Parameters:
    //   path
    //     a string
    //
    // Return
    //   a Context
    //
    if (typeof path !== 'string') {
      throw new Error('Invalid facet path: ' + path)
    }
    if (path.length === 0) {
      throw new Error('Invalid empty facet path: ' + path)
    }
    if (!path.startsWith('/')) {
      throw new Error('Unexpected facet path: ' + path)
    }

    if (path === '/' || path === '/?') {
      // Empty query, empty context
      return new Context([], [])
    }

    if (!path.startsWith('/?')) {
      throw new Error('Unexpected facet path: ' + path)
    }

    const query = path.substring(2)
    return Context.fromQueryString(query)
  }
}
