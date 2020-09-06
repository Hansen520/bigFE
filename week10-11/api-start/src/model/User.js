import mongoose from '../config/DBHelper'
import moment from 'dayjs'

const Schema = mongoose.Schema
const UserSchema = new Schema({
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
mobile: {type: String, match: /^1[3-9(\d{9})]$/, default: ''},
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
  }
}

// 往users数据表中插入数据
const UserModel = mongoose.model('users', UserSchema)

export default UserModel