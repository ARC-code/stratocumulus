module.exports = (test, Context) => {
  test('Context:getRangeValue', (t) => {
    const empty = new Context([])

    t.equal(
      empty.getRangeValue('r_years'),
      null,
      'should be null'
    )

    const ctx = new Context(
      ['f_genres.id', 'f_disciplines.id', 'r_years'],
      ['ABC', 'E', '200to400']
    )

    t.deepEqual(
      ctx.getRangeValue('r_years'),
      { rangeStart: 200, rangeEnd: 400 },
      'should have correct value'
    )

    t.throws(() => {
      ctx.getRangeValue('f_disciplines.id')
    }, 'should detect invalid value')

    t.end()
  })
}
