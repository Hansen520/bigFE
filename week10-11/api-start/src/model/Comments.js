import mongoose from '../config/DBHelper'
// import moment from 'dayjs'
// import CommentsHands from './CommentsHands'


const Schema = mongoose.Schema

const CommentsSchema = new Schema({
  tid: { type: String, ref: 'posts' },
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
  }
}

const Comments = mongoose.model('comments', CommentsSchema)

export default Comments