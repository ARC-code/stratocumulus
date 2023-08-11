module.exports = (test, Context) => {
  test('Context:toCacheKey', (t) => {
    const empty = new Context([])

    t.equal(
      empty.toCacheKey(),
      '/',
      'should be root key'
    )

    const ctx = new Context(
      ['f_genres.id', 'f_disciplines.id', 'q', 'foo'],
      ['ABC', 'E', 'keyword', 'bar']
    )

    t.equal(
      ctx.toCacheKey(),
      '/?f_genres.id=ABC&f_disciplines.id=E&q=keyword',
      'should include only cached parameters'
    )

    const ctxa = new Context(
      ['q', 'f_genres.id'],
      ['keyword', 'ABC']
    )

    t.equal(
      ctxa.toCacheKey(),
      '/?f_genres.id=ABC&q=keyword',
      'should sort queries last'
    )

    t.end()
  })
}
