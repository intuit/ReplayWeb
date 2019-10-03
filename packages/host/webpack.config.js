const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const PermissionsPlugin = require('webpack-permissions-plugin')

module.exports = {
  target: 'node',
  entry: './src/index.js',
  resolve: {
    extensions: ['.js', '.jsx']
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'native.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
        exclude: /(node_modules|bower_components)/
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(path.resolve(__dirname, 'dist')),
    new CopyWebpackPlugin([
      {
        from: 'src/static/*',
        flatten: true
      },
      {
        from: `src/static/${process.env.NODE_ENV === 'production' ? 'nativeHost.sh': 'nativeHostLocal.sh'}`,
        to: 'nativeHost.sh'
      }
    ]),
    new PermissionsPlugin({
      buildFiles: [
        {
          path: path.resolve(__dirname, 'dist', 'nativeHost.sh'),
          fileMode: '755'
        },
        {
          path: path.resolve(__dirname, 'dist', 'install.sh'),
          fileMode: '755'
        }
      ]
    })
  ],
  devtool: 'inline-source-map'
};

// if (process.env.NODE_ENV === 'production') {
//   delete module.exports.devtool
//   module.exports.plugins = (module.exports.plugins || []).concat([
//     new webpack.DefinePlugin({
//       'process.env': {
//         NODE_ENV: '"production"'
//       }
//     }),
//     /*
//     new webpack.optimize.UglifyJsPlugin({
//       compress: {
//         warnings: false,
//         screw_ie8: true,
//         drop_console: true,
//         drop_debugger: true
//       }
//     }),
//      */
//     new webpack.LoaderOptionsPlugin({
//       minimize: true
//     })
//   ])
// }
