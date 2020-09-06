const { default: PostModel } = require("../model/Post")
import Post from '../model/Post'
import Links from '../model/Links'

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
    const result = await PostModel.getList(options, sort, page, limit)
    
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
}

export default new ContentController()