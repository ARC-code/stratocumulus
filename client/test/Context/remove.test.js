module.exports = (test, Context) => {
  test('Context:remove', (t) => {
    const empty = new Context([], [])

    t.deepEqual(
      empty.remove('foo', 'bar').toContextObject(),
      {},
      'trivial empty remove'
    )

    const ctxa = new Context(['f_genres.id'], ['ABC'])

    t.deepEqual(
      ctxa.remove('f_genres.id', 'BCD').toContextObject(),
      { 'f_genres.id': 'ABC' },
      'should not remove non-existing value'
    )

    t.deepEqual(
      ctxa.remove('f_genres.id', 'ABC').toContextObject(),
      {},
      'should remove empty key'
    )

    const ctxb = new Context(['f_genres.id', 'f_genres.id'], ['ABC', 'BCD'])

    t.deepEqual(
      ctxb.remove('f_genres.id', 'ABC').toContextObject(),
      { 'f_genres.id': 'BCD' },
      'should remove only single value'
    )

    t.deepEqual(
      ctxb.remove('f_genres.id').toContextObject(),
      {},
      'should remove all values of the key'
    )

    t.throws(() => {
      ctxa.remove('f_genres.id', '')
    }, 'should detect empty value')

    t.throws(() => {
      ctxa.remove()
    }, 'should detect missing key')

    t.end()
  })
}
