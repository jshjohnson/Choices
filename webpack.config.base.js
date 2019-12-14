const path = require('path');

const include = path.resolve(__dirname, './src/scripts');
const exclude = /node_modules/;

/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
  entry: ['./src/scripts/choices'],
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
        test: /\.ts?$/,
        include,
        exclude,
        options: {
          babelrc: true,
        },
      },
      {
        loader: 'ts-loader',
        test: /\.ts?$/,
        include,
        exclude
      }
    ],
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  output: {
    library: 'Choices',
    libraryTarget: 'window',
    libraryExport: 'default',
    globalObject: 'window',
  },
};
