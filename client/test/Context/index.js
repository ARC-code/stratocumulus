const Context = require('../../lib/Context')

const units = {
  add: require('./add.test'),
  getQueryString: require('./getQueryString.test'),
  merge: require('./merge.test'),
  remove: require('./remove.test')
}

module.exports = (test) => {
  Object.keys(units).forEach((unitName) => {
    units[unitName](test, Context)
  })
}
