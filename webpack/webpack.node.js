
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { merge } = require('webpack-merge')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodeExternals = require('webpack-node-externals')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const common = require('./webpack.common.js')

module.exports = merge(common(), {
  target: 'node',
  output: {
    filename: 'index.node.js',
    library: {
      type: 'commonjs2'
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
              targets: 'node >= 10',
              presets: [
                '@babel/preset-typescript',
                [
                  '@babel/preset-env',
                  {
                    useBuiltIns: 'usage',
                    corejs: '3',
                    modules: 'commonjs'
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
  externals: [
    nodeExternals()
  ]
})
