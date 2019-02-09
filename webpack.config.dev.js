const path = require('path');
const { HotModuleReplacementPlugin } = require('webpack');

module.exports = {
  mode: 'development',
  entry: [
    'webpack/hot/dev-server',
    'webpack-hot-middleware/client',
    './src/scripts/choices',
  ],
  output: {
    path: path.resolve('public'),
    filename: 'choices.min.js',
    publicPath: 'http://localhost:3001/assets/scripts/',
    library: 'Choices',
    libraryTarget: 'umd',
  },
  plugins: [new HotModuleReplacementPlugin()],
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js?$/,
        include: path.join(__dirname, 'src/scripts'),
        exclude: /node_modules/,
        loader: 'eslint-loader',
        query: {
          configFile: '.eslintrc',
        },
      },
      {
        test: /\.js?$/,
        include: path.join(__dirname, 'src/scripts'),
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          babelrc: true,
        },
      },
    ],
  },
};
