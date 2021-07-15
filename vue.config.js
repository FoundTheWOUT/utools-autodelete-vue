/* eslint-disable @typescript-eslint/no-var-requires */
// const CopyPlugin = require("copy-webpack-plugin");
const path = require("path");

module.exports = {
  publicPath: "./",
  outputDir: "./build/dist",
  productionSourceMap: false,
  configureWebpack: {
    resolve: {
      alias: {
        "@": path.resolve("src"),
      },
    },
    plugins: [
      // new CopyPlugin({
      //   patterns: [
      //     {
      //       from: "./README.md",
      //       to: path.resolve(__dirname, "./build/README.md"),
      //     },
      //   ],
      // }),
    ],
  },
};
