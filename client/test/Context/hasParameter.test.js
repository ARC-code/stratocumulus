module.exports = (test, Context) => {
  test('Context:hasParameter', (t) => {
    const empty = new Context([])

    t.false(
      empty.hasParameter('q'),
      'should not have'
    )

    const ctx = new Context(
      ['f_genres.id', 'f_disciplines.id', 'r_years'],
      ['ABC', 'E', '200to400']
    )

    t.true(
      ctx.hasParameter('f_disciplines.id'),
      'should have parameter'
    )

    t.end()
  })
}
