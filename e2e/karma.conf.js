// Karma configuration file, see link for more information
// https://karma-runner.github.io/0.13/config/configuration-file.html
var webpackConfig = require('./webpack.config');

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-remap-istanbul'),
      require('karma-webpack')
    ],
    files: [
      { pattern: './e2e.ts', watched: false }
    ],
    preprocessors: {
      './e2e.ts': ['webpack']
    },
    mime: {
      'text/x-typescript': ['ts','tsx']
    },
    webpack: webpackConfig,
    remapIstanbulReporter: {
      reports: {
        html: 'coverage',
        lcovonly: './coverage/coverage.lcov'
      }
    },
    reporters: config.angularCli && config.angularCli.codeCoverage
              ? ['progress', 'karma-remap-istanbul']
              : ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false
  });
};
