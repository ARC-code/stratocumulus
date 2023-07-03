const Context = require('../../lib/Context')

const units = {
  append: require('./append.test'),
  constructor: require('./constructor.test'),
  fromContextObject: require('./fromContextObject.test'),
  fromQueryString: require('./fromQueryString.test'),
  merge: require('./merge.test'),
  remove: require('./remove.test'),
  toQueryString: require('./toQueryString.test')
}

module.exports = (test) => {
  Object.keys(units).forEach((unitName) => {
    units[unitName](test, Context)
  })
}
