const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  publicPath: "./",
  outputDir: "./build/dist",
  productionSourceMap: false,
  configureWebpack: {
    plugins: [
      new CopyPlugin({
        patterns: [{ from: "./README.md", to: "/build/README.md" }],
      }),
    ],
  },
};
