const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HardSourcePlugin = require('hard-source-webpack-plugin');

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: {
    popup: './src/index.js',
    content_script: './src/ext/content_script.js',
    inject: './src/ext/inject.js',
    background: './src/ext/bg.js'
  },
  resolve: {
    alias: {
      handlebars: 'handlebars/dist/handlebars.min.js'
    },
    extensions: ['.js', '.jsx']
  },
  output: {
    path: path.join(__dirname, 'dist', 'ext'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        options: {
          rootMode: 'upward'
        },
        exclude: /(node_modules|bower_components)/
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.svg$/,
        loader: 'svg-react-loader',
        exclude: /(node_modules|bower_components)/
      }
    ]
  },
  plugins: [
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new HardSourcePlugin(),
    new CleanWebpackPlugin(path.resolve(__dirname, 'dist', 'ext')),
    new CopyWebpackPlugin([
      {
        from: 'extension/*',
        flatten: true,
        ignore: ['*.pem']
      }
    ])
  ],
  devtool: 'inline-source-map'
};

if (process.env.NODE_ENV === 'production') {
  delete module.exports.devtool;
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    /*
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        screw_ie8: true,
        drop_console: true,
        drop_debugger: true
      }
    }),
     */
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ]);
}
