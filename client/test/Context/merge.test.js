module.exports = (test, Context) => {
  test('Context:merge', (t) => {
    const empty = new Context([], [])

    t.deepEqual(
      empty.merge(empty).plain(),
      {},
      'trivial empty merge'
    )

    const ctxa = new Context(['f_genres.id', 'f_disciplines.id'], ['ABC', 'E'])
    const ctxb = new Context(['f_genres.id'], ['BCD'])

    t.deepEqual(
      ctxa.merge(ctxb).plain(),
      { 'f_genres.id': 'ABC__BCD', 'f_disciplines.id': 'E' },
      'merge values'
    )

    t.deepEqual(
      ctxa.merge(ctxa).plain(),
      { 'f_genres.id': 'ABC', 'f_disciplines.id': 'E' },
      'do not merge identical values'
    )

    // Cause accidental null value
    const ctxc = new Context(['f_genres.id'], ['temp'])
    ctxc.values[0] = null

    t.deepEqual(
      ctxb.merge(ctxc).plain(),
      { 'f_genres.id': 'BCD' },
      'do not merge nullish values'
    )

    t.end()
  })
}
