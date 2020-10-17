import mongoose from '../config/DBHelper'
// import moment from 'dayjs'
// import CommentsHands from './CommentsHands'


const Schema = mongoose.Schema

const CommentsSchema = new Schema({
  tid: { type: String, ref: 'posts' },// 帖子id
  uid: { type: String, ref: 'users' }, // 文章作者ID
  cuid: { type: String, ref: 'users' }, // 评论用户的ID
  content: { type: String },
  hands: { type: Number, default: 0 },
  status: { type: String, default: '1' },
  isRead: { type: String, default: '0' },
  isBest: { type: String, default: '0' }
}, { toJSON: { virtuals: true }, timestamps: { createdAt: 'created', updatedAt: 'updated' } })

CommentsSchema.post('save', function (error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('There was a duplicate key error'))
  } else {
    next(error)
  }
})

CommentsSchema.statics = {
  findByTid: function(id){
    return this.find({tid: id})
  },
  findByCid: function(id){
    return this.findOne({ _id: id })
  },
  getCommentsList: function(id, page, limit){
    return this.find({ tid: id }).populate({
      path: 'cuid',// 评论的用户id
      select: '_id name pic isVip',
      match: { status: { $eq: '0' } }
    }).populate({
      path: 'tid',
      select: '_id title status'
    }).skip(page * limit).limit(limit)//skip()方法作用:跳过前面几条数据，limit()方法作用:限制只取几条数据
  },
  queryCount: function(id){
    // 获取总数
    return this.find({ tid: id }).countDocuments()
  },
  // 获取评论
  getCommetsPublic: function(id, page, limit){
    return this.find({cuid: id}).populate({
      path: 'tid',
      select: '_id title'
    })
    .skip(page * limit)
    .limit(limit)
    .sort({created: -1})
  },
  // 获取消息列表(重要接口)
  getMsgList: function(id, page, limit){
    return this.find({
      uid: id,
      // $ne为不等于,就是说cuid的值不等于id才显示
      cuid: { $ne: id },
      // 未读状态
      isRead: { $eq: '0' },
      // 是否显示这条记录(只显示status=1的)
      status: { $eq: '1' }
    }).populate({
      path: 'tid',
      select: '_id title'
    }).populate({
      // 被传递消息者(帖子主人)
      path: 'uid',
      select: '_id name'
    }).populate({
      // 评论者
      path: 'cuid',
      select: '_id name'
    }).skip(limit * page).limit(limit).sort({created: -1})
  },
  // 获取阅读总数
  getTotal: function(id){
    return this.find({uid: id, isRead: '0', status: '1'}).countDocuments()
  }
}

const Comments = mongoose.model('comments', CommentsSchema)

export default Comments