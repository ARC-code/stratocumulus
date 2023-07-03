const Context = require('../../lib/Context')

const units = {
  append: require('./append.test'),
  constructor: require('./constructor.test'),
  getQueryString: require('./toQueryString.test'),
  merge: require('./merge.test'),
  remove: require('./remove.test')
}

module.exports = (test) => {
  Object.keys(units).forEach((unitName) => {
    units[unitName](test, Context)
  })
}
