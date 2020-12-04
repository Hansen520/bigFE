import Comments from '../model/Comments'
import Post from '../model/Post'
import User from '../model/User'
import { checkCode, getJWTPayload } from '../common/Utils'
import CommentsHands from '../model/CommentsHands'
// import UserController from './UserController'
// import PostModel from '../model/Post'

// 设置用户权限
const canReply = async (ctx) => {
  let result = false
  const obj = await getJWTPayload(ctx.header.authorization)
  if (typeof obj._id === 'undefined') {
    return result
  } else {
    const user = await User.findByID(obj._id)
    // 就是说，status=0用户是有权限的
    if (user.status === '0') {
      result = true
    }
    return result
  }
}

class CommentsController {
  // 获取评论列表
  async getComments(ctx) {
    const params = ctx.query
    const tid = params.tid
    // 没有当前页就从第0页开始
    const page = params.page ? params.page : 0
    // 每页限制的条数
    const limit = params.limit ? parseInt(params.limit) : 10
    // 获取文章、评论，用户，作者所有信息
    let result = await Comments.getCommentsList(tid, page, limit)
    // 判断用户登入否，已经登入用户能用点赞
    const auth = ctx.header.authorization
    // 获取用户信息
    const obj = auth ? await getJWTPayload(auth) : {}

    if (obj._id) {
      // 转为JSON格式
      result = result.map((item) => item.toJSON())
      for (let i = 0; i < result.length; i++) {
        // 通过循环的方式将当前文章的每一条评论遍历出来
        let item = result[i]
        item.handed = '0'
        // 查找当前评论id和当前用户id,cid为当前数据id(如果点过赞了才会有这条数据)
        const commentsHands = await CommentsHands.findOne({ cid: item._id, uid: obj._id })
        // console.log(commentsHands)
        // 有数据，并且已经点过赞了
        if (commentsHands && commentsHands.cid) {
          // 而且点过赞的用户id和当前登入的id对上了
          if (commentsHands.uid === obj._id) {
            item.handed = '1'
          }
        }
      }
    }
    // 获取所有该文章的评论的总数
    const total = await Comments.queryCount(tid)
    ctx.body = {
      code: 200,
      data: result,
      total,
      msg: '查询成功'
    }
  }
  // 增加评论
  async addComment(ctx) {
    const check = await canReply(ctx)
    if (!check) {
      ctx.body = {
        code: 500,
        msg: '用户已经被禁言了，可怜！'
      }
      return
    }
    const { body } = ctx.request
    const sid = body.sid
    const code = body.code
    // 验证图片验证码的时效性、正确性
    const result = await checkCode(sid, code)
    if (!result) {
      ctx.body = {
        code: 500,
        msg: '图片验证码不正确,请检查！'
      }
      return
    }
    // 将所有的body内容作为存储对象
    const newComment = new Comments(body)
    // 获取登入的用户信息
    const obj = await getJWTPayload(ctx.header.authorization)
    // 登入时候的用户id
    newComment.cuid = obj._id
    // 根据帖子的id查询帖子的作者，以便发送消息
    const post = await Post.findOne({ _id: body.tid })
    // 把帖子作者的id给评论的uid(同一人)
    newComment.uid = post.uid
    // 保存
    const comment = await newComment.save()
    const num = await Comments.getTotal(post.uid)

    global.ws.send(
      post.uid,
      JSON.stringify({
        event: 'message',
        message: num
      })
    )

    // 评论计数
    const updatePostresult = await Post.updateOne({ _id: body.tid }, { $inc: { answer: 1 } })
    if (comment.id && updatePostresult.ok === 1) {
      ctx.body = {
        code: 200,
        data: comment,
        msg: '评论成功'
      }
    } else {
      ctx.body = {
        code: 500,
        msg: '评论失败'
      }
    }
  }
  // 更新评论
  async updateComment(ctx) {
    const check = await canReply(ctx)
    if (!check) {
      ctx.body = {
        code: 500,
        msg: '用户已经被禁言了，可怜！'
      }
      return
    }
    const { body } = ctx.request
    const result = await Comments.updateOne({ _id: body.cid }, { $set: body })
    ctx.body = {
      code: 200,
      msg: '修改成功',
      data: result
    }
  }
  // 设置采纳
  async setBest(ctx) {
    // 该登入用户
    //{ _id: '5f6bfd159b457c3004f29717', exp: 1602665763, iat: 1602579363 }
    const obj = await getJWTPayload(ctx.header.authorization)
    if (typeof obj === 'undefined' && obj._id !== '') {
      ctx.body = {
        code: '401',
        msg: '用户没有登入，或者呢用户没有授权！'
      }
      return
    }
    // 获取用户权限
    // console.log(obj)
    const params = ctx.query
    // console.log(params)
    const post = await Post.findOne({ _id: params.tid })
    if (post.uid === obj._id && post.isEnd === '0') {
      // 说明是用户本人，且没有结帖，可以去设置isBest
      const result = await Post.updateOne(
        { _id: params.tid },
        {
          $set: {
            isEnd: '1'
          }
        }
      )
      // cid为当前评论id
      const result1 = await Comments.updateOne({ _id: params.cid }, { $set: { isBest: '1' } })
      if (result.ok === 1 && result1.ok === 1) {
        // 把积分值给采纳的用户(获取当前评论用户信息)
        const comment = await Comments.findByCid(params.cid)
        const result2 = await User.updateOne({ _id: comment.cuid }, { $inc: { fav: parseInt(post.fav) } })
        if (result2.ok === 1) {
          ctx.body = {
            code: 200,
            msg: '设置成功了',
            data: result2
          }
        } else {
          ctx.body = {
            code: 500,
            msg: '设置最佳答案时用户积分更新失败'
          }
        }
      } else {
        ctx.body = {
          code: 500,
          msg: '设置失败了',
          data: { ...result, ...result1 }
        }
      }
    } else {
      ctx.body = {
        code: 500,
        msg: '帖子已经结贴了，再也无法设置了wuwu~'
      }
    }
  }
  // 设置点赞
  async setHands(ctx) {
    const obj = await getJWTPayload(ctx.header.authorization)
    const params = ctx.query
    // 判断用户是否已经点赞（评论id，用户id）
    const tmp = await CommentsHands.find({ cid: params.cid, uid: obj._id })
    if (tmp.length > 0) {
      ctx.body = {
        code: 500,
        msg: '您已经点过赞了，请不要重复点赞'
      }
      return
    }
    // 新增一条点赞记录
    const comment = await Comments.findById(params.cid)
    const newHands = new CommentsHands({
      cid: params.cid, // 每一条评论的id
      commentAuth: comment.cuid, // 被评论用户id
      uid: obj._id // 登入者id
    })
    // console.log(newHands)
    const data = await newHands.save()
    // 更新comments表中对应的记录的hands信息 +1
    const result = await Comments.updateOne({ _id: params.cid }, { $inc: { hands: 1 } })
    if (result.ok === 1) {
      ctx.body = {
        code: 200,
        msg: '点赞成功',
        data: data
      }
    } else {
      ctx.body = {
        code: 500,
        msg: '保存点赞记录失败！'
      }
    }
  }
  // 获取用户最近的评论记录
  async getCommentPublic(ctx) {
    const params = ctx.query

    const result = await Comments.getCommetsPublic(params.uid, params.page, parseInt(params.limit))
    if (result.length > 0) {
      ctx.body = {
        code: 200,
        data: result,
        msg: '查询最近的评论记录成功'
      }
    } else {
      ctx.body = {
        code: 500,
        msg: '查询评论记录失败了！'
      }
    }
  }
}

export default new CommentsController()
