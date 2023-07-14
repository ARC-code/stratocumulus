module.exports = (state, action) => {
  // Navigation
  if (action.type === 'navigation') {
    // TODO
    return state
  }

  // Search
  if (action.type === 'filter/keyword') {
    state = state.remove('q')
    if (action.keyword.length > 0) {
      state = state.append('q', action.keyword)
    }
    return state
  }

  if (action.type === 'filter/keyword/clear') {
    return state.remove('q')
  }

  // Year range
  if (action.type === 'filter/years') {
    const value = action.rangeStart + 'to' + action.rangeEnd
    return state.remove('r_years').append('r_years', value)
  }

  // Year range
  if (action.type === 'filter/years/clear') {
    return state.remove('r_years').append('r_years', '400to2100')
  }

  return state
}
