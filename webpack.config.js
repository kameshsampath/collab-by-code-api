const path = require("path");
const fs = require("fs");
const Dotenv = require("dotenv-webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");

var nodeModules = {};
fs.readdirSync("node_modules")
  .filter(function(x) {
    return [".bin"].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = "commonjs " + mod;
  });

module.exports = {
  entry: "./src/app.ts",
  target: "node",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader"
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"]
  },
  plugins: [
    new Dotenv(),
    //new CleanWebpackPlugin(),
    new CopyWebpackPlugin([{ from: "src/data", to: "data" }])
  ],
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist")
  },
  externals: nodeModules
};
