const webpackMerge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.config.base')

const devConfig = {
  mode:'development',
  devtool: 'eval-source-map',
  stats: {
    children: false
  }
}

const webpackConfig = webpackMerge.merge(baseWebpackConfig, devConfig);
module.exports = webpackConfig;