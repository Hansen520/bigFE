import mock from 'mockjs'
// 这个一个获取URL参数的方法
import { getParams } from './utils'

// http://api.yourdomain.com/getlist
mock.mock(/\/api\/yourdomain.test/, function(options){
  // 获取url的参数num
  const num = getParams(options.url, 'num')
  console.log(num)
    var res = {
    "status": 0,
    "msg": '我要返回mock数据了',
    ['data|'+num]: [
      {
        "tid|+1" : 0,
        "title": '@ctitle',
        "catalog": 'index',
        "fav": "@natural(1, 10000)",
        "created": "@datetime('yyyy-MM-dd HH:mm:ss')",
        "isEnd": 0,
        "answer": '@integer(1, 100)',
        "users": {
          "avatar": "@image('56*56')",
          "name": "@cname",
          "isVip": 1,
          "level": "@integer(1, 5)"
        }
      }
    ]
  }
  return mock.mock(res)
});
