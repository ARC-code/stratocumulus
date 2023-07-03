module.exports = (test, Context) => {
  test('Context:getQueryString', (t) => {
    const empty = new Context({})

    t.equal(
      empty.getQueryString(),
      '',
      'trivial empty query string'
    )

    const ctx = new Context({ 'f_genres.id': 'ABC', 'f_disciplines.id': 'E' })

    t.equal(
      ctx.getQueryString(),
      'f_genres.id=ABC&f_disciplines.id=E',
      'should join values to a string'
    )

    t.end()
  })
}
