const path = require('path');
const deepMerge = require('deepmerge');
const WrapperPlugin = require('wrapper-webpack-plugin');

const baseConfig = require('./webpack.config.base');
const { name, version, author, homepage } = require('./package.json');

const arrayMerge = (target, source) => [...source, ...target];

const prodConfig = deepMerge(
  baseConfig,
  {
    mode: 'production',
    output: {
      path: path.join(__dirname, '/public/assets/scripts'),
      publicPath: '/public/assets/scripts/',
    },
    plugins: [
      new WrapperPlugin({
        header: `/*! ${name} v${version} | © ${new Date().getFullYear()} ${author} | ${homepage} */ \n`,
      }),
    ],
  },
  {
    arrayMerge,
  },
);

module.exports = [
  deepMerge(
    prodConfig,
    {
      output: { filename: 'choices.js' },
      optimization: { minimize: false },
    },
    {
      arrayMerge,
    },
  ),
  deepMerge(
    prodConfig,
    { output: { filename: 'choices.min.js' } },
    {
      arrayMerge,
    },
  ),
];
