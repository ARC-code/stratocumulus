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
  //   an integer, document count
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

  // Collect maximum for estimation
  let maxNumInRange = 0
  let numDecadesInRange = 0
  let numDocsInRange = 0

  for (let i = 0; i < numDecades; i += 1) {
    const dec = decadeKeys[i]

    if (beginYear <= dec && dec <= endYear) {
      const decadeNumDocs = decades[dec]
      maxNumInRange = Math.max(maxNumInRange, decadeNumDocs)
      numDecadesInRange += 1
      numDocsInRange += decadeNumDocs
    }
  }

  // Handle narrow range
  if (numDecadesInRange <= 1) {
    return maxNumInRange
  }

  // Estimate from maximum and average
  const avgNumRestDocs = (
    (numDocsInRange - maxNumInRange) / (numDecadesInRange - 1)
  )
  const estimate = maxNumInRange + avgNumRestDocs * 2 / 3

  return Math.round(estimate)
}
