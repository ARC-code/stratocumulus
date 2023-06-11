module.exports = function (subPath) {
  // Get parent stratum path.
  //
  // Parameters:
  //   subPath
  //     a string, the substratum path.
  //
  // Return:
  //   a string
  //

  const stratum = this.strata[subPath]

  if (stratum.path === '/') {
    // Root has no parent
    return null
  }

  console.log(stratum.path, stratum.context)

  // There are two cases where superstratum path is needed.
  // a) user arrived from the root, navigated deeper, and returns back up.
  // b) user arrived to a substratum, and navigates up.
  //
  // In the case a) we locally know which stratum is the immediate parent.
  // In the case b) we know only the set of ancestors but not their order.
  // The user can arrive to the same set (=context) in any order.
  // Therefore in b) we pick just some order, e.g. alphabetic.
  //

  // Handle case a)
  const trailIndex = this.strataTrail.indexOf(subPath)
  if (trailIndex > 0) {
    // Previous
    return this.strataTrail[trailIndex - 1]
  }

  if (trailIndex < 0) {
    // TODO pick parent from context.
  }

  // Else trailIndex 0, i.e.
  return '/'
}
