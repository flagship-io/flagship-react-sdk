
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
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              targets: '> 0.5%, last 2 versions, ie >= 10',
              presets: [
                '@babel/preset-typescript',
                [
                  '@babel/preset-env',
                  {
                    useBuiltIns: 'usage',
                    corejs: '3'
                  }
                ],
                '@babel/preset-react'
              ],
              plugins: [
                '@babel/proposal-class-properties',
                [
                  'add-module-exports',
                  {
                    addDefaultProperty: true
                  }
                ]
              ]
            }
          }
        ]
      }
    ]
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
      allowlist: [/^core-js/, /^regenerator-runtime/, '@flagship.io/js-sdk', 'abort-controller', 'follow-redirects']
    })
  ]
})
