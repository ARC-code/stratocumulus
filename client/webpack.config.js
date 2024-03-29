const webpack = require('webpack')
const path = require('path')

module.exports = {
  entry: './index',
  output: {
    // Bundle file
    filename: 'stratocumulus-client.bundle.js',
    // Target build directory
    path: path.join(__dirname, 'dist'),
    // Source maps for bundle debugging
    sourceMapFilename: '[file].map',
  },

  // TODO switch to production for slower but more compact builds.
  mode: 'development',
  // TODO switch to 'source-map' for slow but production-quality source maps.
  devtool: 'eval-source-map',

  watchOptions: {
    // Polling is necessary when watching via Docker mounted volume.
    poll: 2000,
    // Time before build after first change.
    aggregateTimeout: 1000,
    // Save CPU by skipping large directories.
    ignored: ['**/node_modules']
  },

  // Tapspace build process requires style-loader and css-loader.
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' }
        ]
      },
      {
        test: /\.ejs$/,
        loader: 'ejs-loader',
        options: {
          esModule: false // enable CommonJS modules.
        }
      }
    ]
  }
}
