module.exports = (test, Context) => {
  test('Context:toQueryString', (t) => {
    const empty = new Context([], [])

    t.equal(
      empty.toQueryString(),
      '',
      'trivial empty query string'
    )

    const ctx = new Context(['f_genres.id', 'f_disciplines.id'], ['ABC', 'E'])

    t.equal(
      ctx.toQueryString(),
      'f_genres.id=ABC&f_disciplines.id=E',
      'should join values to a string'
    )

    t.end()
  })
}
