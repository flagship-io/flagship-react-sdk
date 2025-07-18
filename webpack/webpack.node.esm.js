// eslint-disable-next-line @typescript-eslint/no-var-requires
const { merge } = require("webpack-merge");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodeExternals = require("webpack-node-externals");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const common = require("./webpack.common.js");

module.exports = merge(common(), {
  target: "node",
  experiments: {
    outputModule: true,
  },
  output: {
    filename: "index.node.mjs",
    library: {
      type: "module",
    },
    chunkFormat: "module",
  },
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
            },
          },
        ],
      },
    ],
  },
  externalsType: "module",
  externals: [
    nodeExternals({
      importType: "module",
      allowlist: [/core-js\/modules\/es/, /@babel\/runtime/],
    }),
  ],
});
