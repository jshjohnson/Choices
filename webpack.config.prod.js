var path = require('path');
var pkg = require('./package.json');
var webpack = require('webpack');
var wrapperPlugin = require('wrapper-webpack-plugin');
var banner = `/*! ${ pkg.name } v${ pkg.version } | (c) ${ new Date().getFullYear() } ${ pkg.author } | ${ pkg.homepage } */ \n`;

module.exports = function(env) {
  var minimize = env && env.minimize ? true : false;
  var transpile = env && env.transpile ? true : false;

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
    plugins: [
      new webpack.optimize.ModuleConcatenationPlugin(),
      new webpack.DefinePlugin({
        'process.env': {
          // This has effect on the react lib size
          'NODE_ENV': JSON.stringify('production'),
        }
      }),
      new wrapperPlugin({
        header: banner,
      }),
    ],
    module: {
      rules: [{
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        include: path.join(__dirname, 'assets/scripts/src'),
        options: {
          babelrc: false,
          presets: [['es2015', { modules: false }]],
        },
      }]
    }
  };

  if (!transpile) {
    config.output.path = path.join(__dirname, '/assets/scripts/dist/es6');
    config.module.rules[0].options.presets = null;
    config.module.rules[0].options.plugins = ['transform-es2015-modules-commonjs'];
  }

  if (minimize) {
    config.plugins.unshift(
      new webpack.optimize.UglifyJsPlugin({
        sourceMap: false,
        mangle: true,
        output: {
          comments: false
        },
        compress: {
          warnings: false,
          screw_ie8: true
        }
      }),
      new webpack.LoaderOptionsPlugin({
        minimize: true
      })
    );
  }

  return config;
};
