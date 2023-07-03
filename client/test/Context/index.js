const Context = require('../../lib/Context')

const units = {
  append: require('./append.test'),
  constructor: require('./constructor.test'),
  copy: require('./copy.test'),
  fromContextObject: require('./fromContextObject.test'),
  fromQueryString: require('./fromQueryString.test'),
  merge: require('./merge.test'),
  remove: require('./remove.test'),
  removeLastFacet: require('./removeLastFacet.test'),
  toQueryString: require('./toQueryString.test'),
  toStratumPath: require('./toStratumPath.test')
}

module.exports = (test) => {
  Object.keys(units).forEach((unitName) => {
    units[unitName](test, Context)
  })
}
