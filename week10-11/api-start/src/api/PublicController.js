import svgCaptcha from 'svg-captcha'
import { setValue } from '../config/RedisConfig'

class PublicController {
  constructor() {}
  async getChapcha(ctx) {
    const body = ctx.request.query
    // console.log(body)
    const newCaptca = svgCaptcha.create({
      size: 4,
      ignoreChars: '0olil',
      color: true
    })
    // console.log(newCaptca)
    // uuid传到ridis数据库设置唯一通信id, 并设置超时时间
    // 保存图片验证码数据，设置超时时间，单位: s
    // 设置图片验证码超时10分钟
    setValue(body.sid, newCaptca.text, 10 * 60)
    // getValue(body.sid).then((res)=>{
    //   console.log(res)
    // })
    // 返回的数据
    ctx.body = {
      code: 200,
      data: newCaptca.data
    }
  }
}

export default new PublicController()
