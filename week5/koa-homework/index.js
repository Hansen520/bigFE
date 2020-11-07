// 引入koa插件
const Koa = require('koa');
// koa路由
const Router = require('koa-router');
// 协议解析
const koaCors = require('koa-body');
// 路由处理
const koaBody = require('@koa/cors');

// koa实例化
const app = new Koa();
// router实例化
const router = new Router()

// 前缀, 如api/async
router.prefix('/api')

router.post('/user', async ctx => {
  // console.log(ctx);
  let { header, body } = ctx.request;
  console.log(header)
  console.log(body)
  // body为前端传进来的
  if(header.role !== 'admin' || header.role === ''){
    ctx.body = {
      'status': 401,
      'msg': 'unauthorized post!'
    }
  }else if(!body.name || !body.email) {
      ctx.body = {
        'status': 404,
        msg: 'name或email不得为空'
      }
  }
  else {
    ctx.body = {
      code: 200,
      data: body,
      msg: '上传成功'
    }
  }
})

app.use(koaBody());
app.use(koaCors());
app.use(router.routes()).use(router.allowedMethods)

app.listen(1314, ()=>{
  console.log('请求成功!, localhost:1314');
})