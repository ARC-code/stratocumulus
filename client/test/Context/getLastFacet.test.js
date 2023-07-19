module.exports = (test, Context) => {
  test('Context:getLastFacet', (t) => {
    const empty = new Context([])

    t.equal(
      empty.getLastFacet(),
      null,
      'should be null'
    )

    const ctx = new Context(
      ['f_genres.id', 'f_disciplines.id', 'r_years'],
      ['ABC', 'E', '200to400']
    )

    t.deepEqual(
      ctx.getLastFacet(),
      {
        parameter: 'f_disciplines.id',
        value: 'E',
        type: 'f',
        kind: 'disciplines'
      },
      'should have correct structure and values'
    )

    t.end()
  })
}
