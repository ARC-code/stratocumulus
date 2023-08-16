const contextReducer = require('./contextReducer')

module.exports = (state, action) => {
  // Main reducer.
  // This pure function takes in the current state object and an action and
  // returns a new state object. The old state is not modified.
  //
  if (!state) {
    state = {}
  }

  // Context has its dedicated reducer.
  const context = contextReducer(state.context, action)
  if (context !== state.context) {
    state = Object.assign({}, state, { context })
  }

  if (action.type === 'navigation/node') {
    state = Object.assign({}, state, {
      currentNode: {
        parameter: action.parameter,
        value: action.value
      }
    })
  } else {
    // Any other action clears the current node.
    state = Object.assign({}, state, {
      currentNode: null
    })
  }

  return state
}
