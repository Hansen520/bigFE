 // 从redis获取值
 import { getValue } from '../config/RedisConfig'
 import config from '../config/index'
 import jwt from 'jsonwebtoken'
 import fs from 'fs'
 import path from 'path'

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

 const getStats = (path) => {
   return new Promise((resolve) => {
     fs.stat(path, (err, stats) => {
       if(err) {
         resolve(false)
       } else {
         resolve(stats)
       }
     })
   })
 }

 const mkdir = (dir) => {
   return new Promise((resolve) => {
     fs.mkdir(dir, err => err ? resolve(false) : resolve(true))
   })
 }

 // 循环遍历，递归判断如果上级目录不存在，则产生上一级目录
 const dirExists = async (dir) => {
   const isExists = await getStats(dir)
   // 如果该路径存在且不是文件,而是文件夹目录，返回true
   if (isExists && isExists.isDirectory()){
     return true
   } else if(isExists){
      // 如果存在，但是是文件，素以返回true
     return false
   }
    // 如果该路径不存在
    const tempDir = path.parse(dir).dir
    console.log(tempDir)
    // 循环遍历，递归判断如果上级目录不存在，则产生上级目录(递归操作)
    const status = await dirExists(tempDir)
    if(status){
      const result = await mkdir(dir)
      return result
    } else {
      return false
    }
 }
 
 export {
   checkCode,
   getJWTPayload,
   dirExists
 }