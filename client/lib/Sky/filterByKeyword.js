module.exports = function (keyword) {
  // Filter the current stratum by a free-form text query.
  //
  // Parameters:
  //   keyword
  //     a string, a search phrase containing one or more words.
  //

  // TODO filter only the currently focused stratum and hide others.
  for (const path in this.strata) {
    const stratum = this.strata[path]
    stratum.filterByKeyword(keyword)
    // Layout might change, thus reposition the children.
    this.loader.remapChildren(path)
  }
}
