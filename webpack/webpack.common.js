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
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  optimization: {
    minimize: isProduction
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
