import Post from '../model/Post'
import Links from '../model/Links'
import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'
import moment from 'dayjs'
import config from '../config'
import { dirExists } from '../common/Utils'

class ContentController {
  async getPostList (ctx) {
    const body = ctx.query
    // console.log(body)
    // // 测试数据
    // const post = new Post({
    //   title: 'hansen-test',
    //   content: 'test-hansen',
    //   catalog: 'ask',
    //   fav: 20,
    //   isEnd: '0',
    //   isTop: '0',
    //   reads: '0',
    //   answer: '',
    //   status: '0',
    //   sort: '0',
    //   tags: [{
    //     name: '精华',
    //     class: ''
    //   }]
    // })
    // const tem = await post.save()

    // console.log(tem)
    const sort = body.sort ? body.sort : 'created'
    const page = body.page ? parseInt(body.page) : 0
    const limit = body.limit ? parseInt(body.limit) : 20
    const options = {}

    if (typeof body.catalog !== 'undefined' && body.catalog !== ''){
      options.catalog = body.catalog
    }
    if (typeof body.isTop !== 'undefined'){
      options.isTop = body.isTop
    }
    if (typeof body.status !== 'undefined' && body.status !== ''){
      options.status = body.status
    }
    
    if (typeof body.tag !== 'undefined' && body.tag !== '') {
      // 筛选一个数据，因为tag为数组
      options.tags = { $elemMatch: { name:  body.tag } }
    }
    const result = await Post.getList(options, sort, page, limit)
    
    ctx.body = {
      code: 200,
      data: result,
      msg: '获取文章列表成功'
    }
  
  }
  // 查询友链
  async getLinks(ctx){
    const result = await Links.find({ type: 'links' })
    ctx.body = {
      code: 200,
      data: result
    }
  }
  // 友情链接
  async getTips(ctx){
    const result = await Links.find({ type: 'tips' })
    ctx.body = {
      code: 200,
      data: result
    }
  }
  // 本周热议
  async getTopWeek (ctx) {
    const result = await Post.getTopWeek()
    ctx.body = {
      code: 200,
      data: result
    }
  }
  // 上传图片
  async uploadImg (ctx) {
    const file = ctx.request.files.file
    console.log(file)
    // 图片名称、图片格式、存储的位置，返回前台可以读取的路径
    const ext = file.name.split('.').pop()
    const dir = `${config.uploadPath}/${moment().format('YYYYMMDD')}`
    // 判断路径是否存在，如果不存在则重新定义
    await dirExists(dir)
    // 存储文件到指定的路径
    // 给文件一个唯一的名称
    const picname = uuidv4()
    const destPath = `${dir}/${picname}.${ext}`
    // 读写流
    const reader = fs.createReadStream(file.path, {
      highWaterMark: 1 * 1024
    })
    const upStream = fs.createWriteStream(destPath)
    const filePath = `/${moment().format('YYYYMMDD')}/${picname}.${ext}`
    reader.pipe(upStream)
    // let totalLength = 0
    // // 流的读操作
    // reader.on('data', (chunk) => {
    //   // 数据块的拼接
    //   totalLength += chunk.length
    //   if(upStream.write(chunk) === false){
    //     reader.pause()
    //   }
    //   console.log(totalLength)
    // })

    // reader.on('drain', () => {
    //   reader.resume()
    // })

    // reader.on('end', () => {
    //   upStream.end()
    // })
    ctx.body = {
      code: 200,
      msg: '图片上传成功',
      data: filePath
    }
  }

}

export default new ContentController()