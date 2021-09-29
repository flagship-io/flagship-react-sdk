// eslint-disable-next-line @typescript-eslint/no-var-requires
const { merge } = require('webpack-merge')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodeExternals = require('webpack-node-externals')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const common = require('./webpack.common.js')

module.exports = merge(common(), {
  target: 'web',
  resolve: {

  },
  output: {
    filename: 'index.browser.js',
    library: {
      type: 'umd'
    }
  },
  externals: [
    nodeExternals(['@flagship.io/js-sdk'])
  ]
})
