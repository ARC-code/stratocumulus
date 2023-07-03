const Context = require('../../lib/Context')

const units = {
  add: require('./add.test'),
  merge: require('./merge.test')
}

module.exports = (test) => {
  Object.keys(units).forEach((unitName) => {
    units[unitName](test, Context)
  })
}
