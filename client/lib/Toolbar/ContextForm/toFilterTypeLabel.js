module.exports = (key) => {
  // Type label for filter.
  //
  switch (key) {
    case 'r_years':
      return 'years'
    case 'q':
      return 'keyword'
    case 'f_title':
      return 'title'
    case 'f_agents.label.raw':
      return 'person'
    default:
      return key
  }
}
