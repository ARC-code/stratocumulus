module.exports = (test, Context) => {
  test('Context constructor', (t) => {
    const empty = new Context()

    t.notEqual(
      empty.copy(),
      empty,
      'should not be strictly same'
    )

    const ctx = new Context(['f_genres.id'], ['ABC'])

    t.deepEqual(
      ctx.copy().toContextObject(),
      { 'f_genres.id': 'ABC' },
      'should contain same values'
    )

    t.end()
  })
}
