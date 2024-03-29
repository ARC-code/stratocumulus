const Context = require('../../lib/Context')

const units = {
  append: require('./append.test'),
  constructor: require('./constructor.test'),
  copy: require('./copy.test'),
  each: require('./each.test'),
  equals: require('./equals.test'),
  filter: require('./filter.test'),
  fromContextObject: require('./fromContextObject.test'),
  fromFacetPath: require('./fromFacetPath.test'),
  fromQueryString: require('./fromQueryString.test'),
  getFacetingContext: require('./getFacetingContext.test'),
  getFilteringContext: require('./getFilteringContext.test'),
  getLastFacet: require('./getLastFacet.test'),
  getRangeValue: require('./getRangeValue.test'),
  getValue: require('./getValue.test'),
  hasParameter: require('./hasParameter.test'),
  hasValue: require('./hasValue.test'),
  map: require('./map.test'),
  merge: require('./merge.test'),
  remove: require('./remove.test'),
  removeLastFacet: require('./removeLastFacet.test'),
  toArray: require('./toArray.test'),
  toCacheKey: require('./toCacheKey.test'),
  toFacetPath: require('./toFacetPath.test'),
  toNodeKey: require('./toNodeKey.test'),
  toQueryString: require('./toQueryString.test')
}

module.exports = (test) => {
  Object.keys(units).forEach((unitName) => {
    units[unitName](test, Context)
  })
}
