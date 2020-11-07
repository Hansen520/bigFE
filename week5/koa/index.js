const Koa = require('koa')
// 路由
const Router = require('koa-router')
// 跨域处理
const cors = require('@koa/cors')
// 协议解析
const koaBody = require('koa-body')
// json格式化
const json = require('koa-json')
// 就是前面加上前缀，如api/async
router.prefix('/api')
// 实例化Koa
const app = new Koa()
// 设置路由
const router = new Router()
router.get('/', ctx => {
  console.log(ctx);
  console.log(ctx.request)
  ctx.body = "hello world!!3"
})

router.get('/api', ctx => {
  // get params
  const params = ctx.request.query
  console.log(params)
  console.log(params.name, params.age)
  // console.log(ctx);
  // console.log(ctx.request)
  // ctx.body = "hello api!!3"
  ctx.body = {
    name: params.name,
    age: params.age
  }
})

router.get('/async', async (ctx) => {
  let result = await new Promise((resolve) => {
    setTimeout(function(){
      resolve('Hello world 2s later!')
    }, 2000)
  })
  ctx.body = result
})

router.post('/post', async (ctx) => {
  let { body } = ctx.request
  console.log(body)
  console.log(ctx.request);
  ctx.body = {
    ...body
  }
})

app.use(koaBody())
app.use(cors())
// 以json格式化输出
app.use(json({ pretty: false, param: 'pretty' }))
app.use(router.routes()).use(router.allowedMethods())
// 监听3000端口
app.listen(3000)