const path = require("path");
const webpack = require("webpack");
const config = require('./webpack.config.base')
config.entry = path.join(__dirname, './test/index.ts')
config.mode = 'development'
config.plugins.push(new webpack.DefinePlugin({
  'process.env.NODE_ENV': '"test"'
}))

module.exports = config
