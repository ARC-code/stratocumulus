const Context = require('../../lib/Context')

const units = {
  append: require('./append.test'),
  constructor: require('./constructor.test'),
  copy: require('./copy.test'),
  fromContextObject: require('./fromContextObject.test'),
  fromFacetPath: require('./fromFacetPath.test'),
  fromQueryString: require('./fromQueryString.test'),
  merge: require('./merge.test'),
  remove: require('./remove.test'),
  removeLastFacet: require('./removeLastFacet.test'),
  toArray: require('./toArray.test'),
  toFacetPath: require('./toFacetPath.test'),
  toNodeKey: require('./toNodeKey.test'),
  toQueryString: require('./toQueryString.test')
}

module.exports = (test) => {
  Object.keys(units).forEach((unitName) => {
    units[unitName](test, Context)
  })
}
