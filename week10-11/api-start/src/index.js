import statics from 'koa-static'
import helmet from 'koa-helmet'
import JWT from 'koa-jwt'
// const router = require('./routes/routes')
import router from './routes/routes'
// 将中间件进行整合,项目已经安装了webpack，所以可以使用import，上面也是如此
import compose from 'koa-compose'
import koaBody from 'koa-body'
import cors from '@koa/cors'
import config from './config/index'
import errorHandle from './common/ErrorHandle'
import Koa from 'koa'
import path from 'path'
import WebSocketServer from './config/WebSocket'

const app = new Koa()

const ws = new WebSocketServer()
ws.init()
global.ws = ws
console.log(global.ws)

// 定义公共路径，不需要jwt鉴权（比如public和login是不需鉴权的）
const jwt = JWT({secret: config.JWT_SECRET}).unless({ path: [/^\/public/, /^\/login/] })

// 请求的安全头
// const helmet = require('koa-helmet')
// const statics = require('koa-static')

// app.use(helmet())
// app.use(statics(path.join(__dirname, '../assets')))
// app.use(router())
// 整合,使用koa-compose继承中间件
const middleware = compose([
  koaBody({
    multipart: true,
    formidable: {
      // 保存后缀
      keepExtensions: true,
      // 上传时候图片大小
      maxFieldsSize: 5 * 1024 * 1024
    },
    onError: err => {
      console.log(err)
    }
  }),
  // 定义静态
  statics(path.join(__dirname, '../public')),
  cors(),
  helmet(),
  jwt,
  errorHandle
])
app.use(middleware)
app.use(router())
app.listen(3000, ()=>{
  console.log('请求OK！')
})
