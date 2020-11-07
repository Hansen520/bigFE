import svgCaptcha from 'svg-captcha'

class PublicController {
  constructor () {}
  async getChapcha(ctx) {
    const newCaptca = svgCaptcha.create({
      size: 4,
      ignoreChars: '0olil',
      color: true
    })
    console.log(newCaptca)
    // 返回的数据
    ctx.body = {
      code: 200,
      data: newCaptca.data
    }
  }
}

export default new PublicController;