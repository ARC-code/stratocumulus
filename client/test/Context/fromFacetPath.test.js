module.exports = (test, Context) => {
  test('Context.fromFacetPath', (t) => {
    t.deepEqual(
      Context.fromFacetPath('/').toContextObject(),
      {},
      'trivial empty context'
    )

    t.throws(() => {
      Context.fromFacetPath('')
    }, 'should detect empty facet path')

    t.throws(() => {
      Context.fromFacetPath('a')
    }, 'should detect unexpected facet path')

    t.deepEqual(
      Context.fromFacetPath('/?f_genres.id=ABC').toContextObject(),
      { 'f_genres.id': 'ABC' },
      'should handle simple query'
    )

    const q = '/?f_genres.id=ABC&f_genres.id=BCD&f_disciplines.id=E'
    t.deepEqual(
      Context.fromFacetPath(q).toContextObject(),
      { 'f_genres.id': 'ABC__BCD', 'f_disciplines.id': 'E' },
      'should handle duplicate keys'
    )

    t.end()
  })
}
