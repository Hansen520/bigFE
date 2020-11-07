const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')
const resolve = (dir) => path.join(path.resolve(__dirname, "../"), dir)
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')

const isProd = process.env.NODE_ENE === "production"

module.exports = {
  mode: isProd ? 'production' : 'development',
  output: {
    path: resolve('dist'),
    publicPath: '/dist/',
    filename: '[name].[chunkhash].js'
  },
  resolve: {
    alias: {
      'public': resolve('public')
    }
  },
  module: {
    noParse: /es6-promise\.js$/, // avoid webpack shimming process
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          compilerOptions: {
            preserveWhitespace: false
          }
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: '[name].[ext]?[hash]'
        }
      },
      {
        test: /\.s(a|c)ss?$/,
        use: ['vue-style-loader', 'css-loader', 'sass-loader']
      },
    ]
  },
  performance: {
    hints: false
  },
  plugins: [
    new VueLoaderPlugin(),
    new FriendlyErrorsWebpackPlugin()
  ]
}