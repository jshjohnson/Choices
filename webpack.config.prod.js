const path = require('path');
const pkg = require('./package.json');
const webpack = require('webpack');
const WrapperPlugin = require('wrapper-webpack-plugin');

const banner = `/*! ${pkg.name} v${pkg.version} | (c) ${new Date().getFullYear()} ${pkg.author} | ${pkg.homepage} */ \n`;

module.exports = (env) => {
  const minimize = !!(env && env.minimize);

  const config = {
    devtool: minimize ? false : 'cheap-module-source-map',
    entry: [
      './src/scripts/src/choices',
    ],
    output: {
      path: path.join(__dirname, '/src/scripts/dist'),
      filename: minimize ? 'choices.min.js' : 'choices.js',
      publicPath: '/src/scripts/dist/',
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
      new webpack.optimize.ModuleConcatenationPlugin(),
      new webpack.DefinePlugin({
        'process.env': {
          // This has effect on the react lib size
          NODE_ENV: JSON.stringify('production'),
        },
      }),
      new WrapperPlugin({
        header: banner,
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

  if (minimize) {
    config.plugins.unshift(new webpack.optimize.UglifyJsPlugin({
      sourceMap: false,
      mangle: true,
      output: {
        comments: false,
      },
      compress: {
        warnings: false,
        screw_ie8: true,
      },
    }));
  }

  return config;
};
