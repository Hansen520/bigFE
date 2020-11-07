var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
// 清理dist目录插件
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// 复制包文件
const CopyWebpackPlugin = require('copy-webpack-plugin');
// css的代码分割
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// css压缩合并
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
// 复制目录的plugin
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
        use: ['style-loader', MiniCssExtractPlugin.loader,'css-loader', 'sass-loader']
      },
      {
        test: /\.(eot|ttf|svg|woff)$/i,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'font/'
        }
      },
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
      },
      {
        test: /\.js$/,
        loader: 'babel-loader'
      }
    ]
  },
  optimization: {
    minimizer: [new OptimizeCSSAssetsPlugin({})],
  },
  plugins: [
    new HtmlWebpackPlugin({template: './src/index.html'}),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      // 如果你html直接引用则走filename，如果你是间接引用则走chunkFilename
      filename: 'css/[name].css',
      chunkFilename: 'css/[name].chunk.css'
    }),
    new CopyWebpackPlugin({
      patterns:[{
        from: path.join(__dirname, 'asset'),
        to: 'asset'
      }]
    })
  ]
}

module.exports = config;