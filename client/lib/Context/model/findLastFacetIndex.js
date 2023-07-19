module.exports = (keys) => {
  // Find last faceting parameter.
  //
  const len = keys.length
  let last = -1
  for (let i = 0; i < len; i += 1) {
    if (keys[i].startsWith('f_')) {
      last = i
    }
  }

  return last
}
