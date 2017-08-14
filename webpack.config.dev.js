var path = require('path');
var webpack = require('webpack');
var Dashboard = require('webpack-dashboard');
var DashboardPlugin = require('webpack-dashboard/plugin');
var dashboard = new Dashboard();

module.exports = {
  devtool: 'eval',
  entry: [
    'webpack-dev-server/client?http://localhost:3000',
    './assets/scripts/src/choices'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'choices.min.js',
    publicPath: '/assets/scripts/dist/',
    library: 'Choices',
    libraryTarget: 'umd',
  },
  eslint: {
    configFile: '.eslintrc'
  },
  plugins: [
    new DashboardPlugin(dashboard.setData),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('development')
      }
    })
  ],
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      use: ['babel-loader', 'eslint-loader'],
      include: path.join(__dirname, 'assets/scripts/src')
    }]
  }
};
