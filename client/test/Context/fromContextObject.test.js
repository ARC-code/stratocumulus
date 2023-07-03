module.exports = (test, Context) => {
  test('Context.fromContextObject', (t) => {
    t.deepEqual(
      Context.fromContextObject({}).toContextObject(),
      {},
      'trivial empty context'
    )

    t.deepEqual(
      Context.fromContextObject({ 'f_genres.id': 'ABC' }).toContextObject(),
      { 'f_genres.id': 'ABC' },
      'should handle simple object'
    )

    t.end()
  })
}
