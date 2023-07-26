module.exports = (test, Context) => {
  test('Context:getFilteringContext', (t) => {
    const empty = new Context([], [])

    t.deepEqual(
      empty.getFilteringContext().toContextObject(),
      {},
      'trivial empty'
    )

    const ctx = new Context(
      ['f_genres.id', 'r_years', 'q'],
      ['ABC', '200to300', 'keyword']
    )

    t.equal(
      ctx.getFilteringContext().toQueryString(),
      'q=keyword&r_years=200to300',
      'should have only filters in alphabetic order'
    )

    t.end()
  })
}
