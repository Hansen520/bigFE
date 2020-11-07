const koa = require('koa')
const app = new koa()
const path = require('path')
// 请求的安全头
// const helmet = require('koa-helmet')
// const statics = require('koa-static')
import statics from 'koa-static'
import helmet from 'koa-helmet'
// const router = require('./routes/routes')
import router from './routes/routes'
// 将中间件进行整合,项目已经安装了webpack，所以可以使用import，上面也是如此
import compose from 'koa-compose'
import koaBody from 'koa-body'
import cors from '@koa/cors'


// app.use(helmet())
// app.use(statics(path.join(__dirname, '../assets')))
// app.use(router())
// 整合,使用koa-compose继承中间件
const middleware = compose([
  koaBody(),
  statics(path.join(__dirname, '../assets')),
  cors(),
  helmet()
])
app.use(middleware)
app.use(router())
app.listen(3000, ()=>{
  console.log('请求OK！')
})
