import WebSocket from 'ws'
import { getJWTPayload } from '../common/Utils'
import Comments from '../model/Comments'

class WebSocketServer{
  constructor(config = {}){
    const defaultConfig = {
      port: 3001,
      timeInterVal: 5 * 1000,
      isAuth: true
    }
    // 最终配置
    const finalConfig = { ...defaultConfig, ...config }
    this.wss = {}
    this.timeInterVal = finalConfig.timeInterVal
    this.isAuth = finalConfig.isAuth
    this.port = finalConfig.port
    this.options = config.options || {}
  }
  // 初始化websocket服务
  init (){
    this.wss = new WebSocket.Server({ port: this.port, ...this.options })
    // console.log(this.wss)
    // 心跳检测(这个不能要，要了后就不能进行下一步了)
    // this.heartbeat()

    // 连接信息
    this.wss.on('connection', (ws) => {
      // console.log('new client in')
      ws.isAlive = true
      // 连接时候发送心跳
      ws.send(JSON.stringify({
        event: 'heartbeat',
        message: 'ping'
      }))
      ws.on('message', (msg) => this.onMessage(ws, msg))
      ws.on('close', () => this.onClose(ws))

    })
    // 心跳检测(放在初始化后面)
    this.heartbeat()
  }

  onMessage(ws, msg){
    // 用户鉴权 -> token -> _id
    // 心跳检测
    // 消息发送
    const msgObj = JSON.parse(msg)
    const events = {
      auth: async () => {
        try{
          const obj = await getJWTPayload(msgObj.message)
          if(obj){
            // 鉴权开启
            ws.isAuth = true
            ws._id = obj._id
            const num = await Comments.getTotal(obj._id)
            ws.send(JSON.stringify({
              event: 'message',
              message: num
            }))
          }
        } catch(err){
          ws.send(JSON.stringify({
            event: 'noauth',
            message: 'please auth again'
          }))
        }
      },
      // 返回心跳
      heartbeat: () => {
        if(msgObj.message === 'pong'){
          ws.isAlive = true
        }
      },
      message: () => {
        // 鉴权拦截
        // if(!ws.isAuth && this.isAuth){
        //   return
        // }
        // 消息广播
        // this.wss.clients.forEach((client) => {
        //   if(client.readyState === WebSocket.OPEN && client._id === ws._id){
        //     this.send(msg)
        //   }
        // })
      }
    }
    // console.log(events[msgObj.event])
    // 执行auth和heartbeat两个方法
    events[msgObj.event]()
  }
  // 点对点消息发送
  send (uid, msg){
    this.wss.clients.forEach((client)=>{
      if(client.readyState === WebSocket.OPEN && client._id === uid){
        client.send(msg)
      }
    })
  }
  // 广播消息->推送系统消息
  broadcast (msg) {
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN){
        client.send(msg)
      }
    })
  }
  onClose (ws){
    // console.log(ws)
  }

  // 心跳检测
  heartbeat () {
    clearInterval(this.interval)
    this.interval = setInterval(() => {
      this.wss.clients.forEach((ws) => {
        if(!ws.isAlive){
          return ws.terminate()
        }
        // 主动发送心跳检测请求
        // 当客户端返回了消息之后，主动设置flag为在线
        ws.isAlive = false
        ws.send(JSON.stringify({
          event: 'heartbeat',
          message: 'ping'
        }))
      })
    }, this.timeInterVal)
  }
}

export default WebSocketServer