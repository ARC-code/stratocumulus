module.exports = (test, Context) => {
  test('Context constructor', (t) => {
    const empty = new Context()

    t.deepEqual(
      empty.toContextObject(),
      {},
      'trivial empty context'
    )

    t.doesNotThrow(() => {
      new Context(['a', 'b', 'a'], ['x', 'xx', 'xxx'])
    }, 'should allow duplicate key')

    t.throws(() => {
      new Context(['a', 'b', 'a'], ['x', 'xx', 'x'])
    }, 'should detect duplicate key-value')

    t.throws(() => {
      new Context(['a', 'b', 'a'], ['x', 'xx'])
    }, 'should detect conflicting lengths')

    t.end()
  })
}
