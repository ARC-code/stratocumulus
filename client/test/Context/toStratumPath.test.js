module.exports = (test, Context) => {
  test('Context:toStratumPath', (t) => {
    const empty = new Context([])

    t.equal(
      empty.toStratumPath(),
      '/',
      'should be root stratum path'
    )

    const ctx = new Context(
      ['f_genres.id', 'f_disciplines.id', 'r_years'],
      ['ABC', 'E', '200to400']
    )

    t.equal(
      ctx.toStratumPath(),
      '/?f_genres.id=ABC&f_disciplines.id=E',
      'should include only facet parameters'
    )

    t.end()
  })
}
