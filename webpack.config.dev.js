const path = require('path');
const { HotModuleReplacementPlugin } = require('webpack');
const deepMerge = require('deepmerge');
const baseConfig = require('./webpack.config.base');

module.exports = deepMerge(
  baseConfig,
  /** @type {import('webpack').Configuration} */ ({
    mode: 'development',
    output: {
      path: path.resolve(__dirname, './public'),
      filename: 'choices.min.js',
      publicPath: 'http://localhost:3001/assets/scripts/',
    },
    devtool: 'source-map',
    entry: ['webpack/hot/dev-server', 'webpack-hot-middleware/client'],
    plugins: [new HotModuleReplacementPlugin()],
  }),
  {
    arrayMerge(target, source) {
      return [...source, ...target];
    },
  },
);
