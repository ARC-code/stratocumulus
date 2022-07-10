const webpack = require('webpack')
const path = require('path')

const serverDir = path.resolve(__dirname, '..', 'server')

module.exports = {
  entry: './index',
  output: {
    // Bundle file
    filename: 'stratocumulus-client.bundle.js',
    // Target build directory
    path: path.join(serverDir, 'static', 'js'),
    // Source maps for bundle debugging
    sourceMapFilename: '[file].map',
  },

  // TODO switch to production for slower but more compact builds.
  mode: 'development',
  // TODO switch to 'source-map' for slow but production-quality source maps.
  devtool: 'eval-source-map'
}
