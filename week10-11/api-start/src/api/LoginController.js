// 发送email的配置
import send from '../config/MailConfig'
import bcrypt from 'bcrypt'
import moment from 'dayjs'
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
      // 参数为前一个是前端传递过来，后面一个是数据库，然后比对
      if (await bcrypt.compare(body.password, user.password)) {
        checkUserPasswd = true
      }
      // mongoDB查询数据库
      if (checkUserPasswd) {
        const userObj = user.toJSON()
        const arr = ['password', 'username', 'roles']
        arr.map((item)=>{
          // 删除敏感信息然后再传到前端
          delete userObj[item]
        })
        // 验证通过返回Token
        let token = jsonwebtoken.sign({_id: 'hansen', exp: Math.floor(Date.now()/1000) + 60 * 60 * 24}, config.JWT_SECRET)
        ctx.body = {
          code: 200,
          data: userObj,
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
    // 接收客户端的数据
    const { body } = ctx.request 
    // 校验验证码的内容(时效性、有效性)
    let sid = body.sid
    let code = body.code
    let msg = {}
    // 验证图片验证码的时效性，正确性
    let result = await checkCode(sid, code)
    let check = true
    if ( result ) {
      // 查库，看username邮箱是否被注册
      let user1 = await User.findOne({username: body.username})
      // 如果库里有username,且不为空
      if(user1 != null && typeof user1.username !== 'undefined') {
        console.log(user1)
        msg.username = ['此邮箱已经被注册啦，您可以通过邮箱找回密码！']
        check = false
      }
      // 查库，看name是否被注册
      let user2 = await User.findOne({name: body.name})
      // 如果库里有username
      if(user2 != null && typeof user2.name !== 'undefined') {
        msg.name = ['此昵称已经被注册，请修改噢~']
        check = false
      }
    } else {
      msg.code = ['验证码已经失效，请重新获取！']
    }
    // 写入数据到数据库
    if (check) {
      // 加密法则
      body.password = await bcrypt.hash(body.password, 5)
      let user = new User({
        username: body.username,
        name: body.name,
        password: body.password,
        created: moment().format('YYYY-MM-DD HH:mm:ss')
      })
      let result = await user.save()
      // 返回到前端的值
      ctx.body = {
        code: 200,
        data: result,
        msg: '注册成功'
      }
      return
    }
    ctx.body = {
      code: 500,
      msg: msg
    }
  }

}

export default new LoginController()