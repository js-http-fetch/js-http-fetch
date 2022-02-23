const path = require('path');
const webpack = require('webpack');
const htmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, './dist')
  },
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    open: false,
    port: 8000,
    contentBase: 'dist',
    hot: true,
    host: '0.0.0.0',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new htmlWebpackPlugin({
      template: path.join(__dirname, 'examples/index.html'),
      filename: 'index.html'
    })
  ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.ts', '.json'],
    alias: {
      "@": path.resolve('./src'),
    }
  },
  performance: {
    hints: false
  }
}
