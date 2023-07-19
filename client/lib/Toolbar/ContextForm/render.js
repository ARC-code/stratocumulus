const template = require('./template.ejs')
const io = require('../../io')

module.exports = function () {
  // @ContextForm:render()
  //
  // Render the current context.
  //

  // Convert to array for easy filtering.
  let contextArray = this.ctx.toArray()

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
    const title = item.parameter + '=' + item.value

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
