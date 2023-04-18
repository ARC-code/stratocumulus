exports.estimate = (decades, beginYear, endYear) => {
  // Estimate the number of matching documents within the range.
  // We need to estimate, because some documents span multiple decades
  // and thus they are counted many times.
  //
  // Approach suggested by @bptarpley:
  // - take max of range
  // - take average of the rest in range
  // - estimate: max + 2/3 * avg_rest
  //
  // Parameters:
  //   decades
  //     an object, decade -> document count
  //   beginYear
  //     an integer
  //   endYear
  //     an integer
  //
  // Return:
  //   a number, document count
  //

  const decadeKeys = Object.keys(decades)
  const numDecades = decadeKeys.length

  // Handle trivial cases to avoid division by zero problems later.
  if (numDecades === 0) {
    return 0
  }
  if (numDecades === 1) {
    return decades[decadeKeys[0]]
  }

  const maxNumInRange = decadeKeys.reduce((max, decadeKey) => {
    return Math.max(max, decades[decadeKey])
  }, 0)

  const numDocsInRange = decadeKeys.reduce((sum, decadeKey) => {
    const dec = parseInt(decadeKey)
    if (beginYear <= dec && dec <= endYear) {
      const decadeNumDocs = decades[decadeKey]
      return sum + decadeNumDocs
    }
    // Outside the range
    return sum
  }, 0)

  const avgNumRestDocs = (
    (numDocsInRange - maxNumInRange) / (numDecades - 1)
  )

  // Estimate
  return maxNumInRange + avgNumRestDocs * 2 / 3
}
