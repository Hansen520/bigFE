import mongoose from '../config/DBHelper'

const Schema = mongoose.Schema
const UserSchema = new Schema({
  'username': { type: String },
  'name': { type: String },
  'password': { type: String }
})
// 往users数据表中插入数据
const UserModel = mongoose.model('users', UserSchema)

export default UserModel