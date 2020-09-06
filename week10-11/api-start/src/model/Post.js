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
      {
        name: '',
        class: ''
      }
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
  getList: function(options, sort, page, limit) {
    // populate是联合查询，只筛选出uid和name，这样子可以避免出现password等敏感信息
    return this.find(options)
    .sort({ [sort]: -1 })
    .skip(page * limit)
    .limit(limit)
    .populate({
      path: 'uid',
      select: 'name isVip pic'
    })
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
  }
}

// 往post数据表中插入数据
const PostModel = mongoose.model('posts', PostSchema)
console.log(PostModel)
export default PostModel