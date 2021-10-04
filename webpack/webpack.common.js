// Generated using webpack-cli https://github.com/webpack/webpack-cli

// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')

const isProduction = process.env.NODE_ENV === 'production'

const config = {
  entry: './src/index.tsx',
  output: {
    path: path.resolve('./dist')
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              targets: '> 0.5%, last 2 versions, ie >= 10, node >= 6',
              presets: [
                '@babel/preset-typescript',
                [
                  '@babel/preset-env',
                  {
                    useBuiltIns: 'usage',
                    corejs: {
                      version: 3
                    }
                  }
                ],
                ['@babel/preset-react']
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
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  }
}

module.exports = () => {
  if (isProduction) {
    config.mode = 'production'
  } else {
    config.mode = 'development'
  }
  return config
}
