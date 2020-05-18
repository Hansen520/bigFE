import mock from 'mockjs'
// 这个一个获取URL参数的方法
// import { getParams } from './utils'

mock.mock('http://api.yourdomain.com/getlist', {
      "status": 0,
      "user|5": [
        {
          "tid|+1" : 0,
          "title": '@ctitle',
          "catalog": 'index',
          "fav": "@natural(1, 10000)",
          "created": "@datetime('yyyy-MM-dd HH:mm:ss')",
          "isEnd": 0,
          "answer": '@integer(1, 100)',
          "user": {
            "avatar": "@image('100*100')",
            "name": "@cname",
            "isVip": 1,
            "level": "@integer(1, 10)"
          }
        }
      ]
    })

