const path = require('path');

const include = path.resolve(__dirname, './src/scripts');
const exclude = /node_modules/;

/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
  entry: ['./src/scripts/choices'],
  output: {
    library: 'Choices',
    libraryTarget: 'window',
    libraryExport: 'default',
    globalObject: 'window',
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        loader: 'eslint-loader',
        test: /\.js?$/,
        include,
        exclude,
        options: {
          quiet: true,
        },
      },
      {
        loader: 'babel-loader',
        test: /\.js?$/,
        include,
        exclude,
        options: {
          babelrc: true,
        },
      },
    ],
  },
};
