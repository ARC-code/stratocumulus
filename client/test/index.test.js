const test = require('tape')

const units = {
  Context: require('./Context')
}

Object.keys(units).forEach((unitName) => {
  units[unitName](test)
})
