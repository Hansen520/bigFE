import mongoose from '../config/DBHelper'
import moment from 'dayjs'

const Schema = mongoose.Schema
const PostSchema = new Schema({
  // 联合查询，需要对应数据表名称
  uid:	{type: String, ref: 'users'},	
  title:	{type: String, default: ''},	
  content:	{type: String, default: ''},	
  created: {type: Date},	
  catalog:	{type: String},
  fav:	{type: String, default: ''},	
  isEnd:	{type: String, default: '0'},
  reads:	{type: Number, default: 0},
  answer:	{type: Number, default: 0},
  status:	{type: String, default: '0'},
  isTop:	{type: String, default: '0'},
  sort:	{type: String, default: 100},
  tags:	{
    type: Array,
    default: [
      // {
      //   name: '',
      //   class: ''
      // }
    ]
  },
})

PostSchema.virtual('user', {
  ref: 'users',
  localField: 'uid',
  foreignField: '_id'
})

PostSchema.pre('save', function(next){
  this.created = moment().format('YYYY-MM-DD HH:mm:ss')
  next()
})

PostSchema.statics = {
  /**
   * 获取文章列表数据
   * {Obj} options 筛选条件
   * {Str} sort 排序方式
   * {Num} page 分页页数
   * {Num} limit 分页条数
   */
  getList: function (options, sort, page, limit) {
    let query = {}
    if (typeof options.search !== 'undefined') {
      // 如果筛选的是日期
      if (options.item === 'created') {
        const start = options.search[0]// 起始日期
        const end = options.search[1]// 末尾日期
        // &get为大于等于， &lt为小于
        query = { created: { $gte: new Date(start), $lt: new Date(end) } }
      } else if (options.item === 'catalog') {
        query = { catalog: { $in: options.search } }
      } else if (['title', 'user', 'tags'].includes(options.item)) {
        // 如果是用户名和用户，采用正则表达式啦选择, 也就是模糊匹配
        query[options.item] = { $regex: new RegExp(options.search) }
        // 关系数据库的写法 
        // =》 { name: { $regex: /admin/ } } => mysql like %admin%
      } else {
        // radio(一般情况)
        query[options.item] = options.search
      }
    } else {
      // 前端页面一般情况
      query = options
    }
    // populate是联合查询，只筛选出uid和name，这样子可以避免出现password等敏感信息
    return this.find(query).skip(page * limit).limit(limit).sort({ [sort]: -1 }).populate({
      path: 'uid',
      select: 'name isVip pic'
    })
  },
  countList: function (options){
    return this.find(options).countDocuments()
  },
  getTopWeek: function () {
    return this.find({
      created: {
        // 筛选出近7天的数据
        $gte: moment().subtract(7, 'days')
      }
    }, {
      // 筛选出来的数据
      answer: 1,
      title: 1
      // 排序然后限制15条
    }).sort({ answer: -1 }).limit(15)
  },
  // 通过文章id，将uid字段再加一层字典(通过populate的方式)
  findByTid: function(id){
    return this.findOne({ _id: id }).populate({
      path: 'uid',
      select: 'name pic isVip _id'
    })
  },
  // 通过用户id获取用户发帖列表
  getListByUid: function(id, page, limit){
    // 以时间倒序
    return this.find({uid: id}).skip(page*limit).limit(limit).sort({ created: -1 })
  },
  // 获取用户帖子的总数
  countByUid: function(id){
    return this.find({uid: id}).countDocuments()
  }
}

// 往post数据表中插入数据
const PostModel = mongoose.model('posts', PostSchema)
export default PostModel