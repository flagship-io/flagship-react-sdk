
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { merge } = require('webpack-merge')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodeExternals = require('webpack-node-externals')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const common = require('./webpack.common.js')

module.exports = merge(common(), {
  target: 'node',
  output: {
    filename: 'index.js',
    library: {
      type: 'commonjs2'
    }
  },
  optimization: {
    minimize: process.env.NODE_ENV === 'production'
  },
  externals: [
    nodeExternals()
  ]
})
