import combineRouters from 'koa-combine-routers'
import publicRouter from './publicRouter'
import loginRouter from './loginRouter'
import userRouter from './userRouter'

export default combineRouters(
  publicRouter,
  loginRouter,
  userRouter
)