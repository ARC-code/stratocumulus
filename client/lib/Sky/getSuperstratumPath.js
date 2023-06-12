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

  // There are two cases where superstratum path is needed.
  // a) user arrived from the root, navigated deeper, and returns back up.
  // b) user arrived to a substratum, and navigates up.
  //
  // In the case a) we locally know which stratum is the immediate parent.
  // In the case b) we know only the set of ancestors but not their order.
  // The user can arrive to the same set (=context) in any order.
  // Therefore in b) we pick just some order, e.g. alphabetic.
  //

  const stratum = this.strata[subPath]

  // If parent is known
  if (stratum.superpath) {
    return stratum.superpath
  }

  // TODO form possible parents from context
  // (stratum.context)

  return null
}
