const webpackMerge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.config.base.js')
// 对上线时候一些内容不要打包
const terserWebpackPlugin = require('terser-webpack-plugin')

const prodConfig = {
  mode:'development',
  devtool: 'eval-source-map',
  stats: {
    children: false,
    warnings: false
  },
  optimization: {
    minimize: true,
    minimizer: [new terserWebpackPlugin({
      test: /\.js(\?.*)?$/i,
      parallel: 4,
      terserOptions: {
        ecma: undefined,
        warnings: false,
        parse: {},
        compress: {},
        mangle: true, // Note `mangle.properties` is `false` by default.
        module: false,
        output: null,
        toplevel: false,
        nameCache: null,
        keep_classnames: undefined,
        keep_fnames: false,
        safari10: false,
      },
    })],
    splitChunks: {
      cacheGroups: {
        commons: {
          name: 'commons',
          chunks: 'initial',
          minChunks: 2
        }
      }
    }
  },
}

const webpackConfig = webpackMerge.merge(baseWebpackConfig, prodConfig);
module.exports = webpackConfig;