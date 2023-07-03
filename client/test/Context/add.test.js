module.exports = (test, Context) => {
  test('Context:add', (t) => {
    const empty = new Context({})

    t.deepEqual(
      empty.add('foo', 'bar').plain(),
      { 'foo': 'bar' },
      'trivial empty add'
    )

    const ctxa = new Context({ 'f_genres.id': 'ABC' })

    t.deepEqual(
      ctxa.add('f_genres.id', 'BCD').plain(),
      { 'f_genres.id': 'ABC__BCD' },
      'should merge values'
    )

    t.deepEqual(
      ctxa.add('f_disciplines.id', 'E').plain(),
      { 'f_genres.id': 'ABC', 'f_disciplines.id': 'E' },
      'should add key-value'
    )

    t.throws(() => {
      ctxa.add('_genres.id', '')
    }, 'should detect empty')

    t.end()
  })
}
