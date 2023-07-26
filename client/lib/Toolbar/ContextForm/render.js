const template = require('./template.ejs')
const io = require('../../io')
const toFilterLabel = require('./toFilterLabel')
const toFilterTypeLabel = require('./toFilterTypeLabel')

module.exports = function () {
  // @ContextForm:render()
  //
  // Render the current context.
  //

  const facetContext = this.ctx.getFacetingContext()
  let filterContext = this.ctx.getFilteringContext()

  // Remove default filters
  filterContext = filterContext.filter((key, value) => {
    if (key === 'r_years' && value === '400to2100') {
      return false
    }
    if (key === 'q' && value.trim() === '') {
      return false
    }
    return true
  })

  // Add type labels
  const facetArray = facetContext.map((key, value) => {
    const title = key + '=' + value
    const label = io.labelStore.read(key, value)
    const type = 'facet'
    return { title, label, type }
  })

  const filterArray = filterContext.map((key, value) => {
    const title = key + '=' + value
    const parameter = key
    const label = toFilterLabel(key, value)
    const type = toFilterTypeLabel(key)
    return { title, parameter, value, label, type }
  })

  // Render
  this.element.innerHTML = template({
    facets: facetArray,
    filters: filterArray
  })
}
