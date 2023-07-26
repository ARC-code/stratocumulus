module.exports = (test, Context) => {
  test('Context:getFacetingContext', (t) => {
    const empty = new Context([], [])

    t.deepEqual(
      empty.getFacetingContext().toContextObject(),
      {},
      'trivial empty'
    )

    const ctx = new Context(
      ['f_genres.id', 'r_years', 'q', 'f_disciplines.id'],
      ['ABC', '200to300', 'keyword', 'DEF']
    )

    t.equal(
      ctx.getFacetingContext().toQueryString(),
      'f_genres.id=ABC&f_disciplines.id=DEF',
      'should have only facets in the given order'
    )

    t.end()
  })
}
