const template = require('./template.ejs')
const io = require('../../io')

module.exports = function (newContext) {
  // @ContextForm:setContext(newContext)
  //
  // Replace the context and render the new one.
  //

  // Replace
  this.ctx = newContext

  // Convert to array for easy filtering.
  let contextArray = newContext.toArray()

  // Remove default filters
  contextArray = contextArray.filter(item => {
    if (item.parameter === 'r_years' && item.value === '400to2100') {
      return false
    }
    return true
  })

  // Create labels
  const labeledArray = contextArray.map((item) => {
    let label = ''
    let typeLabel = ''
    let title = item.parameter + '=' + item.value

    switch (item.type) {
      case 'f':
        label = io.labelStore.read(item.parameter, item.value)
        typeLabel = 'facet'
        break
      case 'q':
        label = item.value
        typeLabel = 'keyword'
        break
      case 'r':
        label = item.value.replace('to', '–')
        typeLabel = 'years'
        break
      default:
        break
    }

    return { ...item, label, typeLabel, title }
  })

  // Render
  this.element.innerHTML = template({
    facets: labeledArray.filter(item => item.type === 'f'),
    filters: labeledArray.filter(item => ['q', 'r'].includes(item.type))
  })
}
