var path = require('path');
var pkg = require('./package.json');
var webpack = require('webpack');
var wrapperPlugin = require('wrapper-webpack-plugin');
var banner = `/*! ${ pkg.name } v${ pkg.version } | (c) ${ new Date().getFullYear() } ${ pkg.author } | ${ pkg.homepage } */ \n`;
var minimize = process.argv.indexOf('--minimize') !== -1;
var transpile = process.argv.indexOf('--transpile') !== -1;

var config = {
  devtool: 'cheap-module-source-map',
  entry: [
    './assets/scripts/src/choices'
  ],
  output: {
    path: path.join(__dirname, '/assets/scripts/dist'),
    filename: minimize ? 'choices.min.js' : 'choices.js',
    publicPath: '/assets/scripts/dist/',
    library: 'Choices',
    libraryTarget: 'umd',
  },
  libraryTarget: 'umd',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production'),
      }
    }),
    new wrapperPlugin({
      header: banner,
    }),
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      include: path.join(__dirname, 'assets/scripts/src'),
      exclude: /(node_modules|bower_components)/,
      loader: 'babel',
      query: {
        presets: ['es2015']
      }
    }]
  }
};

if (!transpile) {
  config.output.path = path.join(__dirname, '/assets/scripts/dist/es6');
  config.module.loaders[0].query.presets = null;
  config.module.loaders[0].query.plugins = ['transform-es2015-modules-commonjs'];
}

if (minimize) {
  config.plugins.unshift(new webpack.optimize.UglifyJsPlugin({
    sourceMap: false,
    mangle: true,
    output: {
      comments: false
    },
    compress: {
      warnings: false,
      screw_ie8: true
    }
  }));
}

module.exports = config;
