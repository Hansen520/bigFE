import SignRecord from '../model/SignRecord'
import { getJWTPayload } from '../common/Utils'
import User from '../model/User'
import moment from 'dayjs'

class UserController {
  // 用户签到接口
  async userSign (ctx) {
    // 取用户的ID
    // { _id: '5f5340a210faa54588699896', exp: 1600348075, iat: 1600261675 }
    const obj = await getJWTPayload(ctx.header.authorization)
    // 查询用户上一次签到记录
    const record = await SignRecord.findByUid(obj._id)
    // 获取用户的基本信息
    const user = await User.findById(obj._id)
    // console.log(moment(record.created).format('YYYY-MM-DD'))
    let newRecord = {}
    let result
    // 判断签到逻辑
    if(record !== null){
      // 有历史的签到数据
      // 判断用户上一次签到记录的created的事件是否与今天相同
      // 如果当前时间的日期与用户上一次的相同，说明用户已经签到,应该说是同一天签到的
      if(moment(record.created).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')){
        ctx.body = {
          code: 500,
          favs: user.favs,
          count: user.count,
          msg: '用户已经签到'
        } 
      } else {
        // 有上一次的签到记录，并且不与今天相同，进行连续签到的判断
        // 如果相同，代表用户在连续签到
        let count = user.count
        let fav = 0
 
        // 判断签到时间: 用户上一次的签到时间等于当前时间的前一天，说明用户在连续签到
        // 第n+1天签到的时候，需要与第n天的created比较
        if(moment(record.created).format('YYYY-MM-DD') === moment().subtract(1, 'days').format('YYYY-MM-DD')){
          // 连续签到的积分获得逻辑
          count += 1
          if (count < 5){
            fav = 5
          } else if (count >= 5 && count < 15){
            fav = 10
          } else if(count >= 15 && count < 30){
            fav = 15
          } else if (count >= 30 && count < 100){
            fav = 20
          } else if(count >= 100 && count < 365){
            fav = 30
          } else if(count >= 365){
            fav = 50
          }
          await User.updateOne(
            {_id: obj._id},
            {
              // 就是在原来的数据上递增, 即user.favs += fav， user.count += 1
              $inc: {favs: fav, count: 1}
            }
          )
          result = {
            favs: user.favs + fav,
            count: user.count + 1
          }
        } else {
          // 用户中断了一次签到
          fav = 5
          await User.updateOne({_id: obj._id},{
            $set: { count: 1 },
            $inc: { favs: fav }// 就是说又重新从5开始加
          })
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
      await User.updateOne({
        _id: obj._id
      },
      {
        $set: { count: 1 },// 将签到次数置为1
        $inc: { favs: 5 }// 积分数据+5
      })
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
      ctx.body = {
        code: 200,
        msg: '签到成功',
        ...result
      }
    }
    
  }
}

export default new UserController()