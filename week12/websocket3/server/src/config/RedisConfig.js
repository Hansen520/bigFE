const redis = require('redis')
const { promisifyAll } = require('bluebird') 
const {REDIS} = require('./index')
// https://github.com/NodeRedis/node-redis
const options = {
  host: REDIS.host,
  port: REDIS.port,
  password: REDIS.password,
  detect_buffers: true,
  retry_strategy: function(options) {
    if (options.error && options.error.code === "ECONNREFUSED") {
      // End reconnecting on a specific error and flush all commands with
      // a individual error
      return new Error("The server refused the connection");
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
      // End reconnecting after a specific timeout and flush all commands
      // with a individual error
      return new Error("Retry time exhausted");
    }
    if (options.attempt > 10) {
      // End reconnecting with built in error
      return undefined;
    }
    // reconnect after
    return Math.min(options.attempt * 100, 3000);
  },
}

// const client = redis.createClient(options)
const client = promisifyAll(redis.createClient(options))

client.on('error', (err) => {
  console.log('Redis Client Error:' + err)
})

// 抒写set方法
const setValue = (key, value, time) => {
  if (typeof value === 'undefined' || value == null || value === '') {
    // 值为空的时候
    return
  }
  if (typeof value === 'string') {
    // 值为string时候
    if (typeof time !== 'undefined'){
      // 设置过期时间
      client.set(key, value, 'EX', time, (err, result) => {
        console.log('cient.set -> err', err, result)
      })
    } else{
      client.set(key, value)
    }
  } else if (typeof value === 'object'){
    // 值为object时候
    Object.keys(value).forEach((item) => {
      // 通过hash方式全部获取
      client.hset(key, item, value[item], redis.print)
    })
  }
}

const { promisify } = require('util')
const getAsync = promisify(client.get).bind(client)
// 抒写get方法，返回是promise方法，则调用时候可以用then
const getValue = (key) => {
  // 需要调用异步的key
  return getAsync(key)
}
// 返回的是promise
const getHValue = (key) => {
  // return promisify(client.hgetall).bind(client)(key)
  // bluebird async
  return client.hgetallAsync(key)
}

const delValue = (key) => {
  client.del(key, (err, res) => {
    if(res === 1){
      console.log('delete suxxessfully')
    } else {
      console.log('delete redis key err: ' + err)
    }
  })
}
// 是否存在key
const existKey = async function(key){
  const result = await client.existsAsync(key)
  return result
}
// 删除key
const deleteKey = async function(key){
  const result = await client.delAsync(key)
  return result 
}


module.exports= {
  client,
  getValue,
  setValue,
  getHValue,
  delValue,
  existKey,
  deleteKey
}




