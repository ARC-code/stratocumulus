module.exports = (test, Context) => {
  test('Context:filter', (t) => {
    const empty = new Context([], [])

    t.deepEqual(
      empty.filter(() => true).toContextObject(),
      {},
      'trivial all filter'
    )
    t.deepEqual(
      empty.filter(() => false).toContextObject(),
      {},
      'trivial none filter'
    )

    const ctx = new Context(['f_genres.id', 'r_years'], ['ABC', '200to300'])

    t.deepEqual(
      ctx.filter((key, value) => key.startsWith('r_')).toContextObject(),
      { 'r_years': '200to300' },
      'filter values'
    )

    t.end()
  })
}
