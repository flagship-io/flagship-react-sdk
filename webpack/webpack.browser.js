
// eslint-disable-next-line @typescript-eslint/no-var-requires
const webpack = require('webpack')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { merge } = require('webpack-merge')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const common = require('./webpack.common.js')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const TerserPlugin = require('terser-webpack-plugin')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodeExternals = require('webpack-node-externals')

module.exports = merge(common(), {
  target: 'web',
  resolve: {},
  output: {
    filename: 'index.browser.js',
    library: {
      type: 'umd'
    }
  },
  optimization: {
    minimize: process.env.NODE_ENV === 'production',
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          keep_classnames: /AbortSignal/,
          keep_fnames: /AbortSignal/
        }
      })
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      AbortController: 'abort-controller'
    })
  ],
  externals: [
    nodeExternals({
      allowlist: [/^core-js/, /^regenerator-runtime/, '@flagship.io/js-sdk', 'node-fetch', 'abort-controller', 'follow-redirects']
    })
  ]
})
