module.exports = (test, Context) => {
  test('Context:removeLastFacet', (t) => {
    const empty = new Context([], [])

    t.deepEqual(
      empty.removeLastFacet().toContextObject(),
      {},
      'trivial empty remove'
    )

    const ctxa = new Context(['f_genres.id', 'r_years'], ['ABC', '200to400'])

    t.deepEqual(
      ctxa.removeLastFacet().toContextObject(),
      { 'r_years': '200to400' },
      'should remove only facet parameter'
    )

    const ctxb = new Context(
      ['f_genres.id', 'r_years', 'f_disciplines.id'],
      ['ABC', '200to400', 'BCD__EFG']
    )

    t.deepEqual(
      ctxb.removeLastFacet().toContextObject(),
      {
        'f_genres.id': 'ABC',
        'r_years': '200to400',
        'f_disciplines.id': 'BCD'
      },
      'should remove only last facet value'
    )

    t.end()
  })
}
