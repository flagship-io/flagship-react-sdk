// eslint-disable-next-line import/no-extraneous-dependencies
const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: {
    app: './src/index.ts',
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, '../dist'),
    library: 'flagship',
    libraryTarget: 'umd',
    libraryExport: 'default',
  },
  // target: 'node', // TODO:
  module: {
    exprContextCritical: false,
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: 'awesome-typescript-loader',
          },
          {
            loader: 'eslint-loader',
            options: {
              // eslint options (if necessary)
            },
          },
        ],
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
          {
            loader: 'eslint-loader',
            options: {
              // eslint options (if necessary)
            },
          },
        ],
      },
    ],
  },
  externals: [
  ],
  plugins: [new webpack.DefinePlugin({ 'global.GENTLY': false })],
  resolve: {
    extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js'],
  },
};
