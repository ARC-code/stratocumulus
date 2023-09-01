module.exports = (key, value) => {
  // Value label for filter.
  //
  switch (key) {
    case 'r_years':
      return value.replace('to', '–')
    case 'q':
    case 'f_title':
    case 'f_agents.label.raw':
    default:
      return value.trim()
  }
}
