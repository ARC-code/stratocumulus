module.exports = (test, Context) => {
  test('Context:each', (t) => {
    let calls = 0

    const empty = new Context([], [])
    calls = 0
    empty.each(() => { calls += 1 })
    t.equal(calls, 0, 'should not call when empty')

    const ctx = new Context(['f_genres.id', 'r_years'], ['ABC', '200to300'])
    calls = 0
    ctx.each(() => { calls += 1 })
    t.equal(calls, 2, 'should call twice')

    t.end()
  })
}
