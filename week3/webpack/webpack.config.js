var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
// 清理dist目录插件
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const config = {
  mode: 'development',
  entry: {
    mian: './src/index.js'
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'index_bundle.js'
  },
  module: {
    rules: [
      {
        // sass-loader node-sass两个依赖都需要安装
        test: /\.(scss|sass)$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      // {
      //   test: /\.(png|jpg|gif)$/i,
      //   loader: 'file-loader',
      //   options: {
      //     name: '[name].[ext]',
      //     outputPath: 'images/'
      //   }
      // },
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'images/',
              // 小于1024 * 5 的变成base64格式存入js中
              limit: 1024 * 5
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({template: './src/index.html'}),
    new CleanWebpackPlugin()]
}

module.exports = config;