module.exports = (test, Context) => {
  test('Context:getValue', (t) => {
    const empty = new Context([])

    t.equal(
      empty.getValue('q'),
      null,
      'should be null'
    )

    const ctx = new Context(
      ['f_genres.id', 'f_disciplines.id', 'r_years'],
      ['ABC', 'E', '200to400']
    )

    t.equal(
      ctx.getValue('f_disciplines.id'),
      'E',
      'should have correct value'
    )

    t.end()
  })
}
