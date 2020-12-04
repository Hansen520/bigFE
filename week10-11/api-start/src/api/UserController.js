import SignRecord from '../model/SignRecord'
import { getJWTPayload } from '../common/Utils'
import User from '../model/User'
import UserCollect from '../model/UserCollect'
import Comments from '../model/Comments'
import moment from 'dayjs'
import send from '../config/MailConfig'
import { v4 as uuidv4 } from 'uuid'
import jwt from 'jsonwebtoken'
import { getValue, setValue } from '../config/RedisConfig'
import config from '../config/index'
import bcrypt from 'bcrypt'
import qs from 'qs'

class UserController {
  // 用户签到接口
  async userSign(ctx) {
    // 取用户的ID
    // { _id: '5f5340a210faa54588699896', exp: 1600348075, iat: 1600261675 }
    const obj = await getJWTPayload(ctx.header.authorization)
    // 查询用户上一次签到记录
    const record = await SignRecord.findByUid(obj._id)
    // 获取用户的基本信息
    const user = await User.findByID(obj._id)
    // console.log(moment(record.created).format('YYYY-MM-DD'))
    let newRecord = {}
    let result = ''
    // 判断签到逻辑
    if (record !== null) {
      // 有历史的签到数据
      // 判断用户上一次签到记录的created的事件是否与今天相同
      // 如果当前时间的日期与用户上一次的相同，说明用户已经签到,应该说是同一天签到的
      if (moment(record.created).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')) {
        ctx.body = {
          code: 500,
          favs: user.favs,
          count: user.count,
          lastSign: record.created,
          msg: '用户已经签到'
        }
      } else {
        // 有上一次的签到记录，并且不与今天相同，进行连续签到的判断
        // 如果相同，代表用户在连续签到
        let count = user.count
        let fav = 0

        // 判断签到时间: 用户上一次的签到时间等于当前时间的前一天，说明用户在连续签到
        // 第n+1天签到的时候，需要与第n天的created比较
        if (moment(record.created).format('YYYY-MM-DD') === moment().subtract(1, 'days').format('YYYY-MM-DD')) {
          // 连续签到的积分获得逻辑
          count += 1
          if (count < 5) {
            fav = 5
          } else if (count >= 5 && count < 15) {
            fav = 10
          } else if (count >= 15 && count < 30) {
            fav = 15
          } else if (count >= 30 && count < 100) {
            fav = 20
          } else if (count >= 100 && count < 365) {
            fav = 30
          } else if (count >= 365) {
            fav = 50
          }
          await User.updateOne(
            { _id: obj._id },
            {
              // 就是在原来的数据上递增, 即user.favs += fav， user.count += 1
              $inc: { favs: fav, count: 1 }
            }
          )
          result = {
            favs: user.favs + fav,
            count: user.count + 1
          }
        } else {
          // 用户中断了一次签到
          fav = 5
          await User.updateOne(
            { _id: obj._id },
            {
              $set: { count: 1 },
              $inc: { favs: fav } // 就是说又重新从5开始加
            }
          )
          result = {
            favs: user.favs + fav,
            count: 1
          }
        }
        // 更新签到记录
        newRecord = new SignRecord({
          uid: obj._id,
          favs: fav
        })
        await newRecord.save()
      }
    } else {
      // 无签到数据(第一次签到)
      // 保存用户的签到数据，签到计数| 积分数据
      await User.updateOne(
        {
          _id: obj._id
        },
        {
          $set: { count: 1 }, // 将签到次数置为1
          $inc: { favs: 5 } // 积分数据+5
        }
      )
      // 保存用户的签到记录
      newRecord = new SignRecord({
        uid: obj._id,
        favs: 5
      })
      await newRecord.save()
      result = {
        favs: user.favs + 5,
        count: 1
      }
    }
    ctx.body = {
      code: 200,
      msg: '签到成功',
      ...result,
      lastSign: newRecord.created
    }
  }

  // 更新用户基本信息接口
  async updateUserInfo(ctx) {
    const { body } = ctx.request
    const obj = await getJWTPayload(ctx.header.authorization)
    // 判断用户是否修改了邮箱
    const user = await User.findOne({ _id: obj._id })
    let msg = ''
    if (body.username && body.username !== user.username) {
      // 用户修改了邮箱
      // 发送reset邮件
      // 判断用户的新邮箱是否已经有人注册， 如果该邮箱有人注册则return出去
      const tmpUser = await User.findOne({ username: body.username })
      if (tmpUser && tmpUser.password) {
        ctx.body = {
          code: 501,
          msg: '邮箱已经注册'
        }
        return
      }
      const key = uuidv4()
      setValue(
        key,
        jwt.sign({ _id: obj._id }, config.JWT_SECRET, {
          expiresIn: '30m'
        })
      )
      await send({
        type: 'reset',
        data: {
          key: key,
          username: body.username
        },
        code: '',
        expire: moment().add(30, 'minutes').format('YYYY-MM-DD HH:mm:ss'),
        email: user.username,
        user: user.name
      })
      msg = '更新基本资料成功，账号修改需要邮件确认，请注意查收'
    }
    const arr = ['username', 'mobile', 'password']
    arr.map((item) => {
      delete body[item]
    })
    const result = await User.updateOne({ _id: obj._id }, body)
    if (result.n === 1 && result.ok === 1) {
      ctx.body = {
        code: 200,
        msg: msg === '' ? '更新成功' : msg
      }
    } else {
      ctx.body = {
        code: 500,
        msg: '更新失败了!~'
      }
    }
  }
  // 更新用户名
  async updateUsername(ctx) {
    const body = ctx.query
    if (body.key) {
      const token = await getValue(body.key)
      const obj = getJWTPayload('Bearer ' + token)
      await User.updateOne(
        { _id: obj._id },
        {
          username: body.username
        }
      )
      ctx.body = {
        code: 200,
        msg: '更新用户名成功'
      }
    }
  }
  // 修改密码接口
  async changePasswd(ctx) {
    const { body } = ctx.request
    // console.log(body)
    const obj = await getJWTPayload(ctx.header.authorization)
    const user = await User.findOne({ _id: obj._id })
    // console.log(await bcrypt.compare(body.oldpwd, user.password))
    // 密码比对是否相同
    if (await bcrypt.compare(body.oldpwd, user.password)) {
      // 加密新密码
      const newpasswd = await bcrypt.hash(body.newpwd, 5)
      // console.log(newpasswd)
      await User.updateOne({ _id: obj._id }, { $set: { password: newpasswd } })
      ctx.body = {
        code: 200,
        msg: '更新密码成功'
      }
    } else {
      ctx.body = {
        code: 500,
        msg: '密码更新不成功, 你忘记原来的密码了么? ~'
      }
    }
  }
  // 设置收藏
  async setCollect(ctx) {
    const params = ctx.query

    const obj = await getJWTPayload(ctx.header.authorization)
    if (parseInt(params.isFav)) {
      // 说明用户已经收藏了帖子
      await UserCollect.deleteOne({ uid: obj._id, tid: params.tid })
      ctx.body = {
        code: 200,
        msg: '取消收藏成功'
      }
    } else {
      const newCollect = new UserCollect({
        title: params.title,
        uid: obj._id,
        tid: params.tid
      })
      // console.log(newCollect)
      const result = await newCollect.save()
      if (result.uid) {
        ctx.body = {
          code: 200,
          data: result,
          msg: '收藏成功'
        }
      }
    }
  }
  // 收藏的贴列表
  async getCollectByUid(ctx) {
    const params = ctx.query
    const obj = await getJWTPayload(ctx.header.authorization)
    const result = await UserCollect.getListByUid(obj._id, params.page, params.limit ? parseInt(params.limit) : 10)
    if (result.length > 0) {
      ctx.body = {
        code: 200,
        data: result,
        msg: '查询收藏列表成功'
      }
    } else {
      ctx.body = {
        code: 500,
        msg: '查询收藏列表失败'
      }
    }
  }
  // 获取用户基本信息
  async getBasicInfo(ctx) {
    const params = ctx.query
    const obj = await getJWTPayload(ctx.header.authorization)
    const uid = params.uid || obj._id
    let user = await User.findByID(uid)
    // 取得用户的签到记录 有没有 > today 0:00:00
    if (user) {
      user = user.toJSON()
      const data = moment().format('YYYY-MM-DD ')
      const result = await SignRecord.findOne({
        uid: uid,
        created: { $gte: data + '00:00:00' }
      })
      // 用户签到相关
      if (result && result.uid) {
        user.isSign = true
      } else {
        user.isSign = false
      }
    }
    ctx.body = {
      code: 200,
      data: user,
      msg: '查询用户基本信息成功！'
    }
  }
  // 获取历史消息
  // 记录评论之后，给作者发送消息
  async getMsg(ctx) {
    const params = ctx.query
    const page = params.page ? parseInt(params.page) : 0
    const limit = params.limit ? parseInt(params.limit) : 0
    const obj = await getJWTPayload(ctx.header.authorization)
    const num = await Comments.getTotal(obj._id)
    // 这里可以使用aggregate联合查询但是太麻烦，所以采用冗余方式
    // getMsgList重要接口
    const result = await Comments.getMsgList(obj._id, page, limit)
    ctx.body = {
      code: 200,
      data: result,
      total: num
    }
  }

  // 设置已读消息
  async setMsg(ctx) {
    const params = ctx.query
    if (params.id) {
      // 用于删除单挑数据(设置为已阅)
      const result = await Comments.updateOne({ _id: params.id }, { isRead: '1' })
      if (result.ok === 1) {
        ctx.body = {
          code: 200
        }
      }
    } else {
      const obj = await getJWTPayload(ctx.header.authorization)
      // 设置所有数据都已阅
      const result = await Comments.updateMany({ uid: obj._id }, { isRead: '1' })
      const num = await Comments.getTotal(obj._id)
      if (result.ok === 1) {
        ctx.body = {
          code: 200,
          total: num
        }
      }
    }
  }
  /**
   * 后台接口的定义
   */
  // 获取用户信息
  async getUsers(ctx) {
    let params = ctx.query
    params = qs.parse(params)
    const page = params.page ? parseInt(params.page) : 0
    const limit = params.limit ? parseInt(params.limit) : 0
    const sort = params.sort ? params.sort : 'created'
    // option為前端前端传来的数据
    const option = params.option || {}
    // console.log(option)
    const result = await User.getList(option, sort, page, limit)
    const total = await User.countList({})
    ctx.body = {
      code: 200,
      data: result,
      total: total
    }
  }
  // 管理员删除用户
  async deleteUserById(ctx) {
    // const params = ctx.query
    // const user = await User.findOne({ _id: params.id })
    // if (user) {
    //   const result = await User.deleteOne({ _id: params.id })
    //   ctx.body = {
    //     code: 200,
    //     data: result,
    //     msg: '删除成功'
    //   }
    // } else {
    //   ctx.body = {
    //     code: 500,
    //     msg: '用户不存在，删除失败'
    //   }
    // }
    const { body } = ctx.request
    // console.log(body.ids)
    const result = await User.deleteMany({ _id: { $in: body.ids } })
    // console.log('deleteUserById -> result', result)
    ctx.body = {
      code: 200,
      msg: '删除成功',
      data: result
    }
  }
  // 管理员编辑模态框后更新用户
  async updateUserById(ctx) {
    const { body } = ctx.request
    console.log(body)
    const user = await User.findOne({ _id: body._id })
    // 1.校验用户是否存在-> 用户名是否冲突
    if (!user) {
      ctx.body = {
        code: 500,
        msg: '用户不存在或者id信息出现问题！'
      }
      return
    }
    // 这是在编辑时候返回的，我们可以换种思路，用校验的方式，代码如checkUsername
    // if (body.username !== user.username) {
    //   const userCheckName = await User.findOne({ username: body.username })
    //   if (userCheckName) {
    //     ctx.body = {
    //       code: 501,
    //       msg: '用户名已经存在，更新失败！'
    //     }
    //     return
    //   }
    // }

    // 2.判断密码是否传递->进行加密保存
    if (body.password) {
      body.password = await bcrypt.hash(body.password, 5)
    }
    // id家内容
    const result = await User.updateOne({ _id: body._id }, body)
    if (result.ok === 1 && result.nModified === 1) {
      ctx.body = {
        code: 500,
        msg: '更新成功'
      }
    } else {
      ctx.body = {
        code: 500,
        msg: '服务异常，更新失败！'
      }
    }
  }

  // 通过校验的方式检查用户名
  async checkUsername(ctx) {
    const params = ctx.query
    // username是前端传递过来的,第一个为查询出来的数据
    const user = await User.findOne({ username: params.username })
    // 我们定义默认 1为校验通过，0-校验失败
    let result = 1
    // 如果数据库中有用户，则校验失败
    if (user) {
      result = 0
    }
    ctx.body = {
      code: 200,
      data: result,
      msg: '用户名已经存在，请检查！'
    }
  }

  // 添加用户
  async addUser(ctx) {
    const { body } = ctx.request
    // 密码加密
    body.password = await bcrypt.hash(body.password, 5)
    const user = new User(body)
    const result = await user.save()
    // 变成JSON的形式
    const userObj = result.toJSON()
    // 要过滤掉的字段
    const arr = ['password']
    arr.map((item) => {
      delete userObj[item]
    })

    if (result) {
      ctx.body = {
        code: 200,
        data: userObj
      }
    } else {
      ctx.body = {
        code: 500,
        msg: '服务接口异常！'
      }
    }
  }

  async updateUserBatch(ctx) {
    // console.log(ctx)
    const { body } = ctx.request
    const result = await User.updateMany({ _id: { $in: body.ids } }, { $set: { ...body.settings } })
    ctx.body = {
      code: 200,
      data: result
    }
  }
}

export default new UserController()
