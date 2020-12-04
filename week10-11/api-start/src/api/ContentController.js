import Post from '../model/Post'
import Links from '../model/Links'
import fs from 'fs'
import qs from 'qs'
import User from '../model/User'
import PostTags from '../model/PostTags'
import UserCollect from '../model/UserCollect'
import { v4 as uuidv4 } from 'uuid'
import moment from 'dayjs'
import config from '../config'
import { checkCode, dirExists, getJWTPayload } from '../common/Utils'

class ContentController {
  async getPostList(ctx) {
    const body = qs.parse(ctx.query)
    console.log(body)
    const sort = body.sort ? body.sort : 'created'
    const page = body.page ? parseInt(body.page) : 0
    const limit = body.limit ? parseInt(body.limit) : 20
    // 这个options是前台的查询, 如果有后台的body.option就是他，否则赋值为{}
    const options = body.option || {}
    // 前台相关逻辑
    if (body.title) {
      // $regex为模糊查询的字符串
      options.title = { $regex: body.title }
    }
    // $in 操作 查询 field 数组中至少包含一个元素
    if (body.catalog && body.catalog.length > 0) {
      options.catalog = { $in: body.catalog }
    }

    if (body.isEnd) {
      options.isEnd = body.isEnd
    }
    if (body.status) {
      options.status = body.status
    }
    if (typeof body.tag !== 'undefined' && body.tag !== '') {
      // 筛选一个数据，因为tag为数组
      options.tags = { $elemMatch: { name: body.tag } }
    }
    const result = await Post.getList(options, sort, page, limit)
    // 获取条数
    const total = await Post.countList(options)
    ctx.body = {
      code: 200,
      data: result,
      total: total,
      msg: '获取文章列表成功'
    }
  }
  // 查询友链
  async getLinks(ctx) {
    const result = await Links.find({ type: 'links' })
    ctx.body = {
      code: 200,
      data: result
    }
  }
  // 友情链接
  async getTips(ctx) {
    const result = await Links.find({ type: 'tips' })
    ctx.body = {
      code: 200,
      data: result
    }
  }
  // 本周热议
  async getTopWeek(ctx) {
    const result = await Post.getTopWeek()
    ctx.body = {
      code: 200,
      data: result
    }
  }
  // 上传图片
  async uploadImg(ctx) {
    const file = ctx.request.files.file
    // console.log(file)
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
    // 方法1
    // reader.pipe(upStream)
    // 方法2
    // let totalLength = 0
    // 流的读操作
    reader.on('data', (chunk) => {
      // 数据块的拼接
      // totalLength += chunk.length
      if (upStream.write(chunk) === false) {
        reader.pause()
      }
      // console.log(totalLength)
    })

    reader.on('drain', () => {
      reader.resume()
    })

    reader.on('end', () => {
      upStream.end()
    })
    ctx.body = {
      code: 200,
      msg: '图片上传成功',
      data: filePath
    }
  }
  // 添加新帖
  async addPost(ctx) {
    const { body } = ctx.request
    const sid = body.sid
    const code = body.code
    // 验证验证码的时效性、正确性
    const result = await checkCode(sid, code)
    if (result) {
      const obj = await getJWTPayload(ctx.header.authorization)
      // 判断用户的积分数是否 > fav，否则，提示用户积分不足发贴
      // 用户积分足够的时候，新建Post，减除用户对应的积分
      const user = await User.findByID({ _id: obj._id })
      if (user.favs < body.fav) {
        ctx.body = {
          code: 501,
          msg: '积分不足'
        }
        return
      } else {
        await User.updateOne({ _id: obj._id }, { $inc: { favs: -body.fav } })
      }
      const newPost = new Post(body)
      newPost.uid = obj._id
      const result = await newPost.save()
      ctx.body = {
        code: 200,
        msg: '成功的保存了文章！',
        data: result
      }
    } else {
      // 图片验证码失败了噢
      ctx.body = {
        code: 500,
        msg: '图片验证码验证失败了！'
      }
    }
  }
  // 编辑帖子时候，更新
  async updatePost(ctx) {
    const { body } = ctx.request
    const sid = body.sid
    const code = body.code
    // 验证验证码的时效性、正确性
    const result = await checkCode(sid, code)
    if (result) {
      const obj = await getJWTPayload(ctx.header.authorization)
      // 判断帖子是否为本人
      const post = await Post.findOne({ _id: body.tid })
      // console.log(post)
      // 判断是否为本人，判断帖子是否结贴，结了不能编辑
      if (post.uid === obj._id && post.isEnd === '0') {
        const result = await Post.updateOne({ _id: body.tid }, body)
        if (result.ok === 1) {
          ctx.body = {
            code: 200,
            data: result,
            msg: '更新帖子成功'
          }
        } else {
          ctx.body = {
            code: 500,
            data: result,
            msg: '编辑帖子，更新失败'
          }
        }
      } else {
        ctx.body = {
          code: 401,
          msg: '不是你的帖子,没有操作的权限'
        }
      }
    } else {
      // 图片验证码验证失败
      ctx.body = {
        code: 500,
        msg: '图片验证码验证失败'
      }
    }
  }
  // 获取文章详情
  async getPostDetail(ctx) {
    const params = ctx.query
    // 如果没有文章id
    if (!params.tid) {
      ctx.body = {
        code: 500,
        msg: '文章id为空'
      }
      return
    }
    const post = await Post.findByTid(params.tid)
    if (!post) {
      ctx.body = {
        code: 200,
        data: {},
        msg: '查询文章详情不成功'
      }
      return
    }
    // 文章收藏标识
    let isFav = 0
    // 判断用户是否传递Authorization的数据，即是否登录
    if (typeof ctx.header.authorization !== 'undefined' && ctx.header.authorization !== '') {
      const obj = await getJWTPayload(ctx.header.authorization)
      const userCollect = await UserCollect.findOne({
        uid: obj._id,
        tid: params.tid
      })
      if (userCollect && userCollect.tid) {
        // 如果用户收集有这个帖子，那么置为1
        isFav = 1
      }
    }
    const newPost = post.toJSON()
    newPost.isFav = isFav
    // 更新文章阅读计数
    const result = await Post.updateOne({ _id: params.tid }, { $inc: { reads: 1 } })
    if (post._id && result.ok === 1) {
      ctx.body = {
        code: 200,
        data: newPost,
        msg: '查询文章详情成功'
      }
    } else {
      ctx.body = {
        code: 500,
        msg: '获取文章详情失败'
      }
    }
  }
  // 获取用户发帖记录
  async getPostByUid(ctx) {
    const params = ctx.query
    const obj = await getJWTPayload(ctx.header.authorization)
    // 获取数据
    const result = await Post.getListByUid(obj._id, params.page, params.limit ? parseInt(params.limit) : 10)
    // console.log(result)
    // 获取总数
    const total = await Post.countByUid(obj._id)
    if (result.length > 0) {
      ctx.body = {
        code: 200,
        data: result,
        total,
        msg: '查询列表成功'
      }
    } else {
      ctx.body = {
        code: 500,
        msg: '查询列表失败'
      }
    }
  }
  // 删除发贴记录
  async deletePostByUid(ctx) {
    const params = ctx.query
    const obj = await getJWTPayload(ctx.header.authorization)
    const post = await Post.findOne({ uid: obj._id, _id: params.tid })
    if (post.id === params.tid && post.isEnd === '0') {
      // 通过原型链的方式传递
      await ContentController.prototype.deletePost(ctx)
      // const result = await Post.deleteOne({ _id: params.tid })
      // if (result.ok === 1) {
      //   ctx.body = {
      //     code: 200,
      //     msg: '删除成功'
      //   }
      // } else {
      //   ctx.body = {
      //     code: 500,
      //     msg: '执行删除失败！'
      //   }
      // }
    } else {
      ctx.body = {
        code: 500,
        msg: '删除失败，无权限！'
      }
    }
  }
  // 获取用户最近的发贴记录
  async getPostPublic(ctx) {
    const params = ctx.query
    const result = await Post.getListByUid(params.uid, params.page, params.limit ? parseInt(params.limit) : 10)
    if (result.length > 0) {
      ctx.body = {
        code: 200,
        data: result,
        msg: '查询评论列表成功！'
      }
    } else {
      ctx.body = {
        code: 500,
        msg: '查询评论列表失败了！'
      }
    }
  }
  async deletePost(ctx) {
    // const params = ctx.query
    // const result = await Post.deleteOne({ _id: params.tid })
    // if (result.ok === 1) {
    //   ctx.body = {
    //     code: 200,
    //     msg: '删除成功'
    //   }
    // } else {
    //   ctx.body = {
    //     code: 500,
    //     msg: '执行删除失败！'
    //   }
    // }
    const { body } = ctx.request
    const result = await Post.deleteMany({ _id: { $in: body.ids } })
    ctx.body = {
      code: 200,
      data: result,
      msg: '删除帖子成功！'
    }
  }
  async updatePostByTid(ctx) {
    const { body } = ctx.request
    const result = await Post.updateOne({ _id: body._id }, body)
    if (result.ok === 1) {
      ctx.body = {
        code: 200,
        data: result,
        msg: '更新帖子成功'
      }
    } else {
      ctx.body = {
        code: 500,
        data: result
      }
    }
  }
  // 添加标签
  async addTag(ctx) {
    const { body } = ctx.request
    const tag = new PostTags(body)
    await tag.save()
    ctx.body = {
      code: 200,
      msg: '标签保存成功'
    }
  }
  // 获得标签
  async getTags(ctx) {
    const params = ctx.query
    const page = params.page ? parseInt(params.page) : 0
    const limit = params.limit ? parseInt(params.limit) : 10
    const result = await PostTags.getList({}, page, limit)
    const total = await PostTags.countList({})
    ctx.body = {
      code: 200,
      data: result,
      total,
      msg: '查询tags成功！'
    }
  }
  // 删除标签
  async removeTag(ctx) {
    const params = ctx.query
    const result = await PostTags.deleteOne({ id: params.ptid })
    ctx.body = {
      code: 200,
      data: result,
      msg: '删除成功'
    }
  }

  // 更新标签
  async updateTag(ctx) {
    const { body } = ctx.request
    const result = await PostTags.updateOne({ _id: body._id }, body)

    ctx.body = {
      code: 200,
      data: result,
      msg: '更新成功'
    }
  }

  // 更新后台用户权限批量设置
  async updatePostBatch(ctx) {
    // console.log(ctx)
    const { body } = ctx.request
    const result = await Post.updateMany({ _id: { $in: body.ids } }, { $set: { ...body.settings } })
    ctx.body = {
      code: 200,
      data: result
    }
  }
}

export default new ContentController()
