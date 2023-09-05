const template = require('./template.ejs')
const io = require('../io')
const toFilterLabel = require('./toFilterLabel')
const toFilterTypeLabel = require('./toFilterTypeLabel')
const config = require('../config')
const Context = require('../Context')

const MIN_YEAR = config.yearRange.minYear
const MAX_YEAR = config.yearRange.maxYear
const DEFAULT_YEAR_RANGE = MIN_YEAR + 'to' + MAX_YEAR

module.exports = function () {
  // @ContextForm:render()
  //
  // Render the current context.
  //

  const facetContext = this.ctx.getFacetingContext()
  let filterContext = this.ctx.getFilteringContext()

  // Remove default filters
  filterContext = filterContext.filter((key, value) => {
    if (key === 'r_years' && value === DEFAULT_YEAR_RANGE) {
      return false
    }
    if (key === 'q' && value.trim() === '') {
      return false
    }
    return true
  })

  // Add labels and urls
  let cumulativeContext = new Context()
  const facetArray = facetContext.map((key, value) => {
    const type = 'facet'
    const title = key + '=' + value

    let label
    if (key === 'page') {
      label = 'Page ' + value
    } else {
      label = io.labelStore.read(key, value)
      if (!label) {
        label = title
      }
    }

    cumulativeContext = cumulativeContext.append(key, value)
    const query = cumulativeContext.merge(filterContext).toQueryString()
    const url = '/' + (query.length > 0 ? '?' + query : '')

    return { title, label, type, url }
  })

  const filterArray = filterContext.map((key, value) => {
    const title = key + '=' + value
    const parameter = key
    const label = toFilterLabel(key, value)
    const type = toFilterTypeLabel(key)
    return { title, parameter, value, label, type }
  })

  // URL for non-faceted "All"
  const filterQuery = filterContext.toQueryString()
  const rootUrl = '/' + (filterQuery.length > 0 ? '?' + filterQuery : '')

  // Render
  this.element.innerHTML = template({
    rootUrl,
    facets: facetArray,
    filters: filterArray
  })

  // Setup share button interaction
  const buttonEl = this.element.querySelector('.sharing button.share-button')
  const messageEl = this.element.querySelector('.sharing .sharing-message')
  buttonEl.addEventListener('click', () => {
    // Shareable URL for current path
    const currentUrl = window.location.href
    // Copy to clipboard
    window.navigator.clipboard.writeText(currentUrl)
    // Make message visible
    messageEl.style.display = 'block'
    // Make message disappear after a while
    // TODO animate
    setTimeout(() => {
      messageEl.style.display = 'none'
    }, 5000)
  })
}
