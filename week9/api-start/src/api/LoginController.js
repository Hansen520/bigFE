import send from '../config/MailConfig'
import moment from 'moment'

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
    // 验证图片验证码的时效性正确性
    // 验证用户账号是否正确
    // 返回token
  }
  async reg(ctx) {
    
  }

}

export default new LoginController()