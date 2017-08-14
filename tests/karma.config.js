var webpack = require('karma-webpack');

module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    files: [
      '../tests/**/*_spec.js',
    ],
    plugins: [
      webpack,
      'karma-jasmine',
      'karma-phantomjs-launcher',
      'karma-coverage',
      'karma-spec-reporter',
      'karma-htmlfile-reporter',
      'es6-shim'
    ],
    browsers: ['PhantomJS'],
    preprocessors: {
      '**/*_spec.js': ['webpack'],
      'src/**/*.js': ['webpack']
    },
    reporters: ['spec', 'coverage', 'html'],
    coverageReporter: {
      dir: '../tests/reports/coverage',
      reporters: [{
        type: 'html',
      }]
    },
    webpack: {
      module: {
        loaders: [{
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'babel',
          query: {
            presets: ['es2015']
          }
        }]
      }
    },
    colors: true,
    webpackMiddleware: {
      noInfo: true
    },
    htmlReporter: {
      outputFile: 'results/unit-tests.html'
    }
  });
};
