module.exports = (arr, brr) => {
  // Merge two arrays so that the result contains only unique items.
  //
  const result = []
  const add = (item) => {
    if (result.indexOf(item) < 0) {
      result.push(item)
    }
  }
  arr.forEach(add)
  brr.forEach(add)
  return result
}
