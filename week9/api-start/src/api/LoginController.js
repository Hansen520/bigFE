// 发送email的配置
import send from '../config/MailConfig'
import moment from 'moment'
// token校验库
import jsonwebtoken from 'jsonwebtoken'
import config from '../config'
import { checkCode } from '../common/Utils'
import User from '../model/User'

class LoginController {
  constructor(){
  }
  async forget(ctx) {
    const { body } = ctx.request
    console.log(body)
    try {
      let result = await send({
        code: '8868',
        expire: moment().add(30, 'minutes').format('YYYY-MM-DD HH:mm:ss'),
        email: body.email,
        user: 'Hannnsnen'
      })
      // 返回的数据
      ctx.body = {
        code: 200,
        data: result,
        msg: '邮件发送成功'
      }
    }catch(e) {
      console.log(e)
    }
  }
  async login(ctx) {
    // 接收用户的数据
    const { body } = ctx.request
    let sid = body.sid
    let code = body.code
    console.log(sid,code)
    // 验证图片验证码的时效性，正确性
    let result = await checkCode(sid, code)
    console.log('check OK')
    if(result) {
      // 验证用户账号是否正确
      let checkUserPasswd = false
      // 数据库查找
      let user = await User.findOne({ username: body.username })
      if (user.password === body.password) {
        checkUserPasswd = true
      }
      // mongoDB查询数据库
      if (checkUserPasswd) {
        // 验证通过返回Token
        let token = jsonwebtoken.sign({_id: 'hansen', exp: Math.floor(Date.now()/1000) + 60 * 60 * 24}, config.JWT_SECRET)
        ctx.body = {
          code: 200,
          token: token
        }
      } else {
        // 用户名 密码验证失败了，返回提示信息
        ctx.body = {
          code: 404,
          msg: '用户名或者密码错误'
        }
      }
    } else {
      // 图片验证码失败
      ctx.body = {
        code: 401,
        msg: '图片验证码不正确,请检查！'
      }
    }
    
  }
  async reg(ctx) {
    
  }

}

export default new LoginController()