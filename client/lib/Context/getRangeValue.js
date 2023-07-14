module.exports = function (param) {
  // @Context:getRangeValue(param)
  //
  // Returns
  //   a range object { rangeStart, rangeEnd }
  //   null if param not found.
  //
  const i = this.keys.indexOf(param)

  if (i < 0) {
    return null
  }

  const rangeString = this.values[i]

  const parts = rangeString.split('to')
  if (parts.length !== 2) {
    throw new Error('Invalid range value: ' + rangeString)
  }

  const rangeStart = parseInt(parts[0])
  const rangeEnd = parseInt(parts[1])

  return { rangeStart, rangeEnd }
}
