// 发送email的配置
import send from '../config/MailConfig'
import bcrypt from 'bcrypt'
import moment from 'dayjs'
// token校验库
import jsonwebtoken from 'jsonwebtoken'
import config from '../config'
import { checkCode, getJWTPayload } from '../common/Utils'
import User from '../model/User'
import signRecord from '../model/SignRecord'
import { v4 as uuidv4 } from 'uuid'
import { setValue, getValue } from '../config/RedisConfig'

class LoginController {
  constructor() {}
  // 忘记密码
  async forget(ctx) {
    const { body } = ctx.request
    const isHasUser = await User.findOne({ username: body.username })
    // console.log(isHasUser)
    if (!isHasUser) {
      ctx.body = {
        code: 404,
        msg: '当前用户名邮箱不存在'
      }
      return
    }
    try {
      const key = uuidv4()
      // 通过忘记密码设置key，然后传递到发送邮箱的方式放到async reset()里面
      setValue(
        key,
        jsonwebtoken.sign({ _id: isHasUser._id }, config.JWT_SECRET, {
          expiresIn: '30m'
        }),
        30 * 60
      )
      let result = await send({
        type: 'forgetpassword',
        data: {
          key: key,
          username: body.username
        },
        expire: moment().add(30, 'minutes').format('YYYY-MM-DD HH:mm:ss'),
        email: body.username,
        user: isHasUser.name ? isHasUser.name : body.username
      })
      // 返回的数据
      ctx.body = {
        code: 200,
        data: result,
        msg: '邮件发送成功'
      }
    } catch (e) {
      console.log(e)
    }
  }
  // 登入
  async login(ctx) {
    // 接收用户的数据
    const { body } = ctx.request
    let sid = body.sid
    let code = body.code
    // 验证图片验证码的时效性，正确性
    let result = await checkCode(sid, code)
    console.log('check OK')
    if (result) {
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
        // const arr = ['password', 'username', 'roles']
        const arr = ['password', 'username']
        arr.map((item) => {
          // 删除敏感信息然后再传到前端
          delete userObj[item]
        })
        // 验证通过返回Token
        let token = jsonwebtoken.sign(
          { _id: userObj._id, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 },
          config.JWT_SECRET
        )
        // 加入isSign属性,就是做一个标记属性
        const SignRecord = await signRecord.findByUid(userObj._id)
        if (SignRecord !== null) {
          if (moment(SignRecord.created).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')) {
            userObj.isSign = true
          } else {
            userObj.isSign = false
          }
          userObj.lastSign = signRecord.created
        } else {
          // 用户无签到记录
        }
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
  // 注册
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
    if (result) {
      // 查库，看username邮箱是否被注册
      let user1 = await User.findOne({ username: body.username })
      // 如果库里有username,且不为空
      if (user1 != null && typeof user1.username !== 'undefined') {
        // console.log(user1)
        msg.username = ['此邮箱已经被注册啦，您可以通过邮箱找回密码！']
        check = false
      }
      // 查库，看name是否被注册
      let user2 = await User.findOne({ name: body.name })
      // 如果库里有username
      if (user2 != null && typeof user2.name !== 'undefined') {
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
  // 重置密码
  async reset(ctx) {
    // 接收客户端的数据
    const { body } = ctx.request
    let sid = body.sid
    let code = body.code
    let msg = {}
    // 验证图片大的正确性，时效性
    let result = await checkCode(sid, code)
    if (!body.key) {
      ctx.body = {
        code: 500,
        msg: '请求参数异常，请重新获取链接'
      }
      return
    }
    if (!result) {
      msg.code = ['验证码已经失效，请重新获取！']
      ctx.body = {
        code: 500,
        msg: msg
      }
      return
    }
    const token = await getValue(body.key)
    if (token) {
      const obj = getJWTPayload('Bearer ' + token)
      // 密码加密
      body.password = await bcrypt.hash(body.password, 5)
      await User.updateOne(
        { _id: obj._id },
        {
          password: body.password
        }
      )
      ctx.body = {
        code: 200,
        msg: '更新用户密码成功！'
      }
    } else {
      ctx.body = {
        code: 500,
        msg: '链接已经失效'
      }
    }
  }
}

export default new LoginController()
