const Context = require('./Context')

module.exports = (state, action) => {
  // Context reducer.
  // This pure function takes in the current state object and an action and
  // returns a new state object. The old state is not modified.
  //

  // Navigation
  if (action.type === 'navigation') {
    const facetContext = Context.fromFacetPath(action.path)
    const filterContext = state.getFilteringContext()
    return facetContext.merge(filterContext)
  }

  // Search full text
  if (action.type === 'filter/keyword') {
    state = state.remove('q')
    if (action.keyword.length > 0) {
      state = state.append('q', action.keyword)
    }
    return state
  }

  // Search title
  if (action.type === 'filter/title') {
    state = state.remove('f_title')
    if (action.title.length > 0) {
      state = state.append('f_title', action.title)
    }
    return state
  }

  // Search author
  if (action.type === 'filter/person') {
    state = state.remove('f_agents.label.raw')
    if (action.name.length > 0) {
      state = state.append('f_agents.label.raw', action.name)
    }
    return state
  }

  // Year range
  if (action.type === 'filter/years') {
    const value = action.rangeStart + 'to' + action.rangeEnd
    return state.remove('r_years').append('r_years', value)
  }

  // Clear a filter
  if (action.type === 'filter/clear') {
    const parameter = action.parameter
    return state.remove(parameter)
  }

  return state
}
