const path = require('path');

module.exports = {
  entry: './e2e/e2e.ts',
  output: {
    filename: 'bundle.js'
  },
  target: 'node',
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: ['.ts', '.tsx', '.js'] // note if using webpack 1 you'd also need a '' in the array as well
  },
  module: {
    loaders: [ // loaders will work with webpack 1 or 2; but will be renamed "rules" in future
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      { test: /\.ts$/, loader: 'ts-loader', exclude: [/\.spec\.(ts|tsx)$/] }
    ]
  }
}