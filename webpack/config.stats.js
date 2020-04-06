const merge = require('webpack-merge');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const devConfig = require('./config.dev.js');

module.exports = merge(devConfig, {
  plugins: [
    new BundleAnalyzerPlugin(),
  ],
});
