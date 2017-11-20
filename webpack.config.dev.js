const path = require('path');
const webpack = require('webpack');
const Dashboard = require('webpack-dashboard');
const DashboardPlugin = require('webpack-dashboard/plugin');

const dashboard = new Dashboard();

module.exports = {
  devtool: 'eval',
  entry: [
    'webpack-dev-server/client?http://localhost:3000',
    './src/scripts/src/choices',
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'choices.min.js',
    publicPath: '/src/scripts/dist/',
    library: 'Choices',
    libraryTarget: 'umd',
  },
  plugins: [
    new DashboardPlugin(dashboard.setData),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
      },
    }),
  ],
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js?$/,
        include: path.join(__dirname, 'src/scripts/src'),
        exclude: /(node_modules|bower_components)/,
        loader: 'eslint-loader',
        query: {
          configFile: '.eslintrc',
        },
      },
      {
        test: /\.js?$/,
        include: path.join(__dirname, 'src/scripts/src'),
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
      },
    ],
  },
};
