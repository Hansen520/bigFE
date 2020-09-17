 // 从redis获取值
 import { getValue } from '../config/RedisConfig'
 import config from '../config/index'
 import jwt from 'jsonwebtoken'

 const getJWTPayload = token => {
   // 返回布尔值，判断token是否过期
   return jwt.verify(token.split(' ')[1], config.JWT_SECRET)
 }
 const checkCode = async (key, value) => {
   const redisData = await getValue(key)
   if (redisData != null) {
     if (redisData.toLowerCase() === value.toLowerCase()) {
       return true
     } else {
       return false
     }
   } else {
     return false
   }
 }

 export {
   checkCode,
   getJWTPayload
 }