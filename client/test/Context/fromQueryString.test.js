module.exports = (test, Context) => {
  test('Context.fromQueryString', (t) => {
    t.deepEqual(
      Context.fromQueryString('').toContextObject(),
      {},
      'trivial empty context'
    )

    t.deepEqual(
      Context.fromQueryString('f_genres.id=ABC').toContextObject(),
      { 'f_genres.id': 'ABC' },
      'should handle simple query'
    )

    const q = 'f_genres.id=ABC&f_genres.id=BCD&f_disciplines.id=E'
    t.deepEqual(
      Context.fromQueryString(q).toContextObject(),
      { 'f_genres.id': 'ABC__BCD', 'f_disciplines.id': 'E' },
      'should handle duplicate keys'
    )

    t.end()
  })
}
