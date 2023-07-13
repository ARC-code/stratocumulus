module.exports = (test, Context) => {
  test('Context:toArray', (t) => {
    const empty = new Context([])

    t.deepEqual(
      empty.toArray(),
      [],
      'should be empty array'
    )

    const ctx = new Context(
      ['f_genres.id', 'f_disciplines.id', 'r_years'],
      ['ABC', 'E', '200to400']
    )

    t.deepEqual(
      ctx.toArray(),
      [
        {
          parameter: 'f_genres.id',
          value: 'ABC',
          type: 'f'
        },
        {
          parameter: 'f_disciplines.id',
          value: 'E',
          type: 'f'
        },
        {
          parameter: 'r_years',
          value: '200to400',
          type: 'r'
        }
      ],
      'should have correct structure and order'
    )

    t.end()
  })
}
