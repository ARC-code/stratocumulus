module.exports = (test, Context) => {
  test('Context:toCacheKey', (t) => {
    const empty = new Context([])

    t.equal(
      empty.toCacheKey(),
      '/',
      'should be root key'
    )

    const ctx = new Context(
      ['f_genres.id', 'f_disciplines.id', 'q', 'r_years'],
      ['ABC', 'E', 'keyword', '200to400']
    )

    t.equal(
      ctx.toCacheKey(),
      '/?f_genres.id=ABC&f_disciplines.id=E&q=keyword',
      'should include only cached parameters'
    )

    t.end()
  })
}
