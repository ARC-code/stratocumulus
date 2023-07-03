module.exports = (test, Context) => {
  test('Context constructor', (t) => {
    const empty = new Context()

    t.deepEqual(
      empty.toContextObject(),
      {},
      'trivial empty context'
    )

    t.throws(() => {
      new Context(['a', 'b', 'a'], ['x', 'xx', 'xxx'])
    }, 'should detect duplicate key')

    t.end()
  })
}
