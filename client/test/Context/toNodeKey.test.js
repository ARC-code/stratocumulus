module.exports = (test, Context) => {
  test('Context:toNodeKey', (t) => {
    const empty = new Context([])

    t.equal(
      empty.toNodeKey(),
      '/',
      'should work but log a warning'
    )

    const ctx = new Context(
      ['f_genres.id', 'f_disciplines.id', 'r_years'],
      ['ABC', 'E', '200to400']
    )

    t.equal(
      ctx.toNodeKey(),
      '/arc/disciplines/e',
      'should have correct structure and case'
    )

    t.end()
  })
}
