const koa = require('koa')
const app = new koa()
const path = require('path')
// 请求的安全头
const helmet = require('koa-helmet')
const statics = require('koa-static')

const router = require('./routes/routes')

app.use(helmet())
app.use(statics(path.join(__dirname, '../assets')))
app.use(router())

app.listen(3000, ()=>{
  console.log('请求OK！')
})
