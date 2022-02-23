const path = require("path");
const webpack = require("webpack");
const config = require('./webpack.config.base')
config.entry = path.join(__dirname, './examples/main.ts')
config.plugins.push(new webpack.DefinePlugin({
  'process.env.NODE_ENV': '"development"'
}))
module.exports = config
