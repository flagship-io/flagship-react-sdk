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
    libraryTarget: 'commonjs',
    libraryExport: 'default',
  },
  // target: 'node', // TODO:
  module: {
    exprContextCritical: false,
    rules: [
      {
        // test: /\.tsx?$/,
        test: /\.(ts|js)x?$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: 'babel-loader',
          },
          // {
          //   loader: 'awesome-typescript-loader',
          // },
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
    {
      react: 'react',
      reactDOM: 'react-dom',
    },
  ],
  plugins: [new webpack.DefinePlugin({ 'global.GENTLY': false })],
  resolve: {
    alias: {
      // modules: [path.resolve('./node_modules')],
      react: path.resolve('./node_modules/react'),
    },
    extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js'],
  },
};
