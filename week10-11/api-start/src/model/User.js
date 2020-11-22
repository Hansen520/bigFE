import mongoose from '../config/DBHelper'
import moment from 'dayjs'

const Schema = mongoose.Schema
const UserSchema = new Schema({
// uid为自身产生的obj._id
// sparse就是有username才会去检索,index代表数据唯一性
username: {type: String, index: { unique: true }, sparse: true},
password: {type: String},
name: {type: String},
created: {type: Date},
updated: {type: Date},
favs: {type: Number, default: 100},
gender: {type: String, default: ''},
roles: {type: Array, default: ['user']},
pic: {type: String, default: '/img/tim0g.jpg'},
mobile: {type: String, match: /^1[3456789]\d{9}$/, default: ''},
status: {type: String, default: '0'},
regmark: {type: String, default: ''},
location: {type: String, default: ''},
isVip: {type: String, default: '0'},
count: {type: Number, default: 0},
})
// pre为前置钩子(这里为串行钩子)，post为后置钩子
UserSchema.pre('save', function(next){
  this.created = moment().format('YYYY-MM-DD HH:mm:ss')
  next()
})

UserSchema.pre('update', function(next){
  this.updated = moment().format('YYY-MM-DD HH:mm:ss')
  next()
})
// 后置中间件被执行后，钩子的方法和所有的前置中间件已经完成(这里是异步钩子)
UserSchema.post('save', function(error, doc, next){
  // 避免往数据库插入重复的数据，代号11000
  if(error.name === 'MongoError' && error.code === 11000){
    next(new Error('Error: Mongoose has a duplicate key.'))
  } else {
    next(error)
  }
  
})

UserSchema.statics = {
  findByID: function(id) {
    // 不查找password等敏感信息
    return this.findOne({_id: id}, {
      password: 0,
      username: 0,
      mobile: 0
    })
  },
  getList: function(options, sort, page, limit) {
    let query = {}
    if (typeof options.search !== 'undefined') { 
      // 如果筛选的是日期
      if (options.item === 'created') {
        const start = options.search[0]// 起始日期
        const end = options.search[1]// 末尾日期
        // &get为大于等于， &lt为小于
        query = { created: { $gte: new Date(start), $lt: new Date(end) } }
      } else if (options.item === 'roles') {
        query = { roles: { $in: options.search } }
      } else if (['name', 'username'].includes(options.item)) {
        // 如果是用户名和用户，采用正则表达式啦选择, 也就是模糊匹配
        query[options.item] = { $regex: new RegExp(options.search) }
        // 关系数据库的写法 
        // =》 { name: { $regex: /admin/ } } => mysql like %admin%
      } else { 
        // radio(一般情况)
        query[options.item] = options.search
      }
    }
    console.log(query)
    // {password: 0}这样做可以屏蔽敏感信息
    return this.find(query, { password: 0 }).skip(page * limit).limit(limit).sort({ [sort]: -1 })
  },
  countList: function(options) {
    // populate是联合查询，只筛选出uid和name，这样子可以避免出现password等敏感信息
    return this.find(options).countDocuments()
  },
}

// 往users数据表中插入数据
const UserModel = mongoose.model('users', UserSchema)

export default UserModel