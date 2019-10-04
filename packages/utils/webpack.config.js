const path = require('path')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const name = 'replay-utils'
module.exports = {
  target: 'node',
  entry: path.join(__dirname, 'src', 'index.js'),
  resolve: {
    extensions: ['.js']
  },
  output: {
    path: path.join(__dirname, 'lib'),
    filename: `${name}.js`,
    libraryTarget: 'umd',
    library: name
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /(node_modules|bower_components)/
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(path.resolve(__dirname, 'lib')),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
  ]
}

if (process.env.NODE_ENV === 'production') {
  module.exports.plugins = [...module.exports.plugins, new UglifyJsPlugin()]
}
