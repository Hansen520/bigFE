const DB_URL = 'mongodb://root:example@122.51.156.210:27017/admin'
const JWT_SECRET = '1234567890'

const REDIS = {
  host: '122.51.156.210',
  port: 15001
}
// 返回前端的基础地址
const baseUrl = process.env.NODE_ENV === 'production' ? 'http://www.toimc.com' : 'http://localhost:8080'
export default {
  DB_URL,
  REDIS,
  JWT_SECRET,
  baseUrl
}