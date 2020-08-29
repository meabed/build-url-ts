/* eslint-env node */

const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  entry: {
    bulidUrl: "./src/build-url.js",
  },
  output: {
    filename: "[name].js",
    path: __dirname + "/dist",
  },
  mode: "production",
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
};
