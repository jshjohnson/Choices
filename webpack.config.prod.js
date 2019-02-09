const path = require('path');
const WrapperPlugin = require('wrapper-webpack-plugin');
const UnminifiedWebpackPlugin = require('unminified-webpack-plugin');

const pkg = require('./package.json');

const banner = `/*! ${pkg.name} v${
  pkg.version
} | (c) ${new Date().getFullYear()} ${pkg.author} | ${pkg.homepage} */ \n`;

module.exports = {
  mode: 'production',
  entry: ['./src/scripts/choices'],
  output: {
    path: path.join(__dirname, '/public/assets/scripts'),
    filename: 'choices.min.js',
    publicPath: '/public/assets/scripts/',
    library: 'Choices',
    libraryTarget: 'umd',
    auxiliaryComment: {
      root: 'Window',
      commonjs: 'CommonJS',
      commonjs2: 'CommonJS2',
      amd: 'AMD',
    },
  },
  plugins: [
    new WrapperPlugin({
      header: banner,
    }),
    new UnminifiedWebpackPlugin(),
  ],
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js?$/,
        include: path.join(__dirname, 'src/scripts'),
        exclude: /(node_modules|bower_components)/,
        loader: 'eslint-loader',
        query: {
          configFile: '.eslintrc',
        },
      },
      {
        test: /\.js?$/,
        include: path.join(__dirname, 'src/scripts'),
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        options: {
          babelrc: true,
        },
      },
    ],
  },
};
