module.exports = (test, Context) => {
  test('Context:equals', (t) => {
    const empty = new Context([], [])

    t.ok(
      empty.equals(empty),
      'trivial same object'
    )
    t.ok(
      empty.equals(new Context()),
      'trivial empty'
    )

    const ctx = new Context(['f_genres.id', 'r_years'], ['ABC', '200to300'])

    t.ok(
      ctx.equals(ctx),
      'equal keys and values'
    )

    t.notOk(
      empty.equals(ctx),
      'detect trivial difference'
    )
    t.notOk(
      ctx.equals(new Context(['f_genres.id', 'r_years'], ['ABC', '100to300'])),
      'detect value difference'
    )

    t.end()
  })
}
