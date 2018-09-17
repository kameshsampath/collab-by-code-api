const path = require("path");
const fs = require("fs");
const Dotenv = require("dotenv-webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");

var nodeModules = {};
var pluginModules = [new CopyWebpackPlugin([{ from: "src/data", to: "data" }])];

if (process.env.NODE_ENV === "Development") {
  pluginModules.push(new Dotenv());
} else {
  pluginModules.push(new CleanWebpackPlugin());
}

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
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: {
              minimize: true,
              attrs: false
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"]
  },
  plugins: pluginModules,
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist")
  },
  externals: nodeModules
};
