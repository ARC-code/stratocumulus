module.exports = (test, Context) => {
  test('Context:map', (t) => {
    const empty = new Context([], [])

    t.deepEqual(
      empty.map(() => true),
      [],
      'trivial empty map'
    )

    const ctx = new Context(['f_genres.id', 'r_years'], ['ABC', '200to300'])

    t.deepEqual(
      ctx.map((key, value) => value),
      ['ABC', '200to300'],
      'map values'
    )

    t.end()
  })
}
