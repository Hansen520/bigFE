export default (ctx, next) => {
  return next().catch((err) => {
    if (401 === err.status) {
      ctx.status = 401
      ctx.body = {
        code: 401,
        msg: 'Protexted resource, use Authorization header get access\n',
      }
    } else {
      ctx.status = err.status || 500
      ctx.body = Object.assign({
        code: 500,
        msg: err.message
        // 错误端口调试方法
      }, process.env.NODE_ENV === 'development'? { stack: err.stack }: {})
    }
  })
}