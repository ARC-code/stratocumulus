module.exports = (test, Context) => {
  test('Context:append', (t) => {
    const empty = new Context([], [])

    t.deepEqual(
      empty.append('foo', 'bar').plain(),
      { 'foo': 'bar' },
      'trivial empty append'
    )

    const ctxa = new Context(['f_genres.id'], ['ABC'])

    t.deepEqual(
      ctxa.append('f_genres.id', 'BCD').plain(),
      { 'f_genres.id': 'ABC__BCD' },
      'should merge values'
    )

    t.deepEqual(
      ctxa.append('f_disciplines.id', 'E').plain(),
      { 'f_genres.id': 'ABC', 'f_disciplines.id': 'E' },
      'should append key-value'
    )

    t.throws(() => {
      ctxa.append('f_genres.id', '')
    }, 'should detect empty')

    t.end()
  })
}
