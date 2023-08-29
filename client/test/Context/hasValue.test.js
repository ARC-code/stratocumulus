module.exports = (test, Context) => {
  test('Context:hasValue', (t) => {
    const empty = new Context([])

    t.false(
      empty.hasValue('q', 'hello'),
      'should not have'
    )

    const ctx = new Context(
      ['f_genres.id', 'f_disciplines.id', 'r_years'],
      ['ABC', 'E', '200to400']
    )

    t.true(
      ctx.hasValue('f_disciplines.id', 'E'),
      'should have value'
    )
    t.false(
      ctx.hasValue('f_disciplines.id', 'D'),
      'should not have value regardless has parameter'
    )

    t.end()
  })
}
