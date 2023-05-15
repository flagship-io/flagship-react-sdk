
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
              presets: [
                '@babel/preset-typescript',
                [
                  '@babel/preset-env',
                  {
                    targets: { node: 12 },
                    modules: false,
                    useBuiltIns: 'usage',
                    corejs: 3
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
    nodeExternals({
      allowlist: [
        /core-js\/modules\/es/,
        /@babel\/runtime/
      ]
    })
  ]
})
