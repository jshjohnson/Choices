const path = require('path');
const deepMerge = require('deepmerge');
const { BannerPlugin } = require('webpack');

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
      new BannerPlugin(
        `${name} v${version} | © ${new Date().getFullYear()} ${author} | ${homepage}`,
      ),
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
      output: { filename: 'choices.js', libraryTarget: 'umd' },
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
