const resolution = require('../config').decades.resolution

module.exports = (num) => {
  return Math.round(num / resolution) * resolution
}
