module.exports = (test, Context) => {
  test('Context:merge', (t) => {
    const empty = new Context([], [])

    t.deepEqual(
      empty.merge(empty).toContextObject(),
      {},
      'trivial empty merge'
    )

    const ctxa = new Context(['f_genres.id', 'f_disciplines.id'], ['ABC', 'E'])
    const ctxb = new Context(['f_genres.id'], ['BCD'])

    t.deepEqual(
      ctxa.merge(ctxb).toContextObject(),
      { 'f_genres.id': 'ABC__BCD', 'f_disciplines.id': 'E' },
      'merge values'
    )

    t.throws(() => {
      ctxa.merge(ctxa)
    }, 'detect duplicate values')

    // Cause accidental null value
    const ctxc = new Context(['f_genres.id'], ['temp'])
    ctxc.values[0] = null

    t.throws(() => {
      ctxb.merge(ctxc)
    }, 'detect nullish values')

    t.end()
  })
}
